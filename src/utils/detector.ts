import { MAGIC_NUMBERS } from './magicNumbers';

export interface DetectionResult {
  claimedExtension: string;
  realExtension: string | 'Unknown';
  isSpoofed: boolean;
}

export const analyzeFile = (file: File): Promise<DetectionResult> => {
  return new Promise((resolve, reject) => {
    // 1. Extract what the file CLAIMS to be
    const filenameParts = file.name.split('.');
    const claimedExtension = filenameParts.length > 1 
      ? filenameParts.pop()!.toLowerCase() 
      : 'none';

    // 2. Read the first 12 bytes. 
    // We need 12 bytes because some formats (like WAV/WEBP) hide their true 
    // signature at byte offset 8, inside a generic "RIFF" container.
    const blob = file.slice(0, 12);
    const reader = new FileReader();

    reader.onloadend = function(e) {
      if (!e.target || e.target.readyState !== FileReader.DONE) {
        reject(new Error("Failed to read file."));
        return;
      }

      // 3. Convert bytes to a full hexadecimal string
      const buffer = e.target.result as ArrayBuffer;
      const uint8Array = new Uint8Array(buffer);
      let fullHexSignature = '';
      for (let i = 0; i < uint8Array.length; i++) {
        fullHexSignature += uint8Array[i].toString(16).padStart(2, '0');
      }

      // 4. Extract the first 4 bytes (8 hex characters) for our base lookup
      const baseSignature = fullHexSignature.substring(0, 8);
      const detectedType = MAGIC_NUMBERS[baseSignature];

      let realExt = 'Unknown';
      let isSpoofed = false;

      if (detectedType) {
        realExt = detectedType.extension;

        // ==========================================
        // EDGE CASE HANDLING
        // ==========================================

        // EDGE CASE 1: RIFF Containers (WAV, AVI, WEBP)
        // If it's a RIFF file, the real format is declared in bytes 8-11 (hex chars 16-24)
        if (realExt === 'riff' && fullHexSignature.length >= 24) {
          const riffTypeHex = fullHexSignature.substring(16, 24);
          if (riffTypeHex === '57415645') realExt = 'wav';      // ASCII for "WAVE"
          else if (riffTypeHex === '41564920') realExt = 'avi'; // ASCII for "AVI "
          else if (riffTypeHex === '57454250') realExt = 'webp';// ASCII for "WEBP"
        }

        // EDGE CASE 2: ZIP Containers (Modern Office, OpenDocument, Android Apps)
        const validZipExtensions = [
          'zip', 
          'docx', 'xlsx', 'pptx', // Microsoft Office
          'odt', 'ods', 'odp', 'odg', // OpenDocument
          'apk', // Android
          'jar', // Java
          'epub' // E-books
        ];

        // EDGE CASE 3: OLE / CFB Containers (Legacy MS Office)
        const validOleExtensions = ['doc', 'xls', 'ppt', 'msi'];

        // EDGE CASE 4: JPEG naming variations
        const validJpegExtensions = ['jpg', 'jpeg', 'jpe'];

        // ==========================================
        // FINAL VALIDATION
        // ==========================================
        
        if (realExt === 'zip' && validZipExtensions.includes(claimedExtension)) {
          isSpoofed = false;
          realExt = claimedExtension; // It's valid, so reflect the specific sub-type
        } 
        else if (baseSignature === 'd0cf11e0' && validOleExtensions.includes(claimedExtension)) {
          isSpoofed = false;
          realExt = claimedExtension;
        } 
        else if (realExt === 'jpg' && validJpegExtensions.includes(claimedExtension)) {
          isSpoofed = false;
        } 
        else {
          // If no special container rules apply, do a direct match
          isSpoofed = claimedExtension !== realExt;
        }
      }

      resolve({
        claimedExtension,
        realExtension: realExt,
        isSpoofed: detectedType ? isSpoofed : false, // Don't flag if we just don't recognize the file
      });
    };

    reader.onerror = () => reject(new Error("Error reading file."));
    reader.readAsArrayBuffer(blob);
  });
};