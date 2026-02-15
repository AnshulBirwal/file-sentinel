import { MAGIC_NUMBERS } from './magicNumbers';

export interface DetectionResult {
  claimedExtension: string;
  realExtension: string | 'Unknown';
  isSpoofed: boolean;
}

export const analyzeFile = (file: File): Promise<DetectionResult> => {
  return new Promise((resolve, reject) => {
    const filenameParts = file.name.split('.');
    const claimedExtension = filenameParts.length > 1 
      ? filenameParts.pop()!.toLowerCase() 
      : 'none';

    // EDGE CASE: Empty files
    if (file.size === 0) {
      resolve({ claimedExtension, realExtension: 'Empty File', isSpoofed: false });
      return;
    }

    const blob = file.slice(0, 12);
    const reader = new FileReader();

    reader.onloadend = function(e) {
      if (!e.target || e.target.readyState !== FileReader.DONE) {
        reject(new Error("Failed to read file."));
        return;
      }

      const buffer = e.target.result as ArrayBuffer;
      const uint8Array = new Uint8Array(buffer);
      let fullHexSignature = '';
      for (let i = 0; i < uint8Array.length; i++) {
        fullHexSignature += uint8Array[i].toString(16).padStart(2, '0');
      }

      const baseSignature = fullHexSignature.substring(0, 8);
      let detectedType = MAGIC_NUMBERS[baseSignature];
      let realExt = 'Unknown';
      let isSpoofed = false;

      // ==========================================
      // SPECIAL CHECK: ISOBMFF Containers 
      // (MP4, MOV, HEIC, AVIF, M4A)
      // Look for "ftyp" (66747970) at bytes 4-7.
      // ==========================================
      if (fullHexSignature.length >= 16 && fullHexSignature.substring(8, 16) === '66747970') {
        detectedType = { extension: 'isobmff', mime: 'video/mp4' };
        realExt = 'isobmff'; // We will map this to the specific claimed extension if valid
      } else if (detectedType) {
        realExt = detectedType.extension;
      }

      // ==========================================
      // VALIDATION GROUPS
      // ==========================================
      
      const validZipExtensions = ['zip', 'docx', 'xlsx', 'pptx', 'odt', 'ods', 'odp', 'odg', 'apk', 'jar', 'epub'];
      const validOleExtensions = ['doc', 'xls', 'ppt', 'msi'];
      const validIsobmffExtensions = ['mp4', 'mov', 'm4v', 'm4a', '3gp', 'heic', 'heif', 'avif'];
      const validXmlExtensions = ['xml', 'svg', 'html', 'htm'];
      const validJpegExtensions = ['jpg', 'jpeg', 'jpe'];
      const validExeExtensions = ['exe', 'dll', 'sys', 'scr'];
      
      // EDGE CASE: Plain text files don't have magic numbers. 
      // If we find no signature, check if it's supposed to be a text format.
      const plainTextExtensions = ['txt', 'csv', 'json', 'md', 'js', 'ts', 'jsx', 'tsx', 'css', 'env'];

      if (detectedType) {
        // EDGE CASE: RIFF Containers (WAV, AVI, WEBP)
        if (realExt === 'riff' && fullHexSignature.length >= 24) {
          const riffTypeHex = fullHexSignature.substring(16, 24);
          if (riffTypeHex === '57415645') realExt = 'wav';      
          else if (riffTypeHex === '41564920') realExt = 'avi'; 
          else if (riffTypeHex === '57454250') realExt = 'webp';
        }

        // Apply whitelists to known container/legacy types
        if (realExt === 'zip' && validZipExtensions.includes(claimedExtension)) {
          isSpoofed = false;
          realExt = claimedExtension; 
        } 
        else if (baseSignature === 'd0cf11e0' && validOleExtensions.includes(claimedExtension)) {
          isSpoofed = false;
          realExt = claimedExtension;
        } 
        else if (realExt === 'isobmff' && validIsobmffExtensions.includes(claimedExtension)) {
          isSpoofed = false;
          realExt = claimedExtension;
        }
        else if ((baseSignature === '3c3f786d' || baseSignature === '3c737667') && validXmlExtensions.includes(claimedExtension)) {
          isSpoofed = false;
          realExt = claimedExtension;
        }
        else if (realExt === 'jpg' && validJpegExtensions.includes(claimedExtension)) {
          isSpoofed = false;
        }
        else if (realExt === 'exe' && validExeExtensions.includes(claimedExtension)) {
          isSpoofed = false;
        }
        else {
          // No special container rules apply, do a strict match
          isSpoofed = claimedExtension !== realExt;
        }
      } else {
        // If NO magic number is found, is it a known plain text file?
        if (plainTextExtensions.includes(claimedExtension)) {
          isSpoofed = false;
          realExt = 'Plain Text'; // Tell the UI it's verified as text
        }
      }

      resolve({
        claimedExtension,
        realExtension: realExt,
        isSpoofed: detectedType ? isSpoofed : false, // Don't flag if it's completely unknown (avoids false positives)
      });
    };

    reader.onerror = () => reject(new Error("Error reading file."));
    reader.readAsArrayBuffer(blob);
  });
};