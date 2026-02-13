export interface FileType {
  extension: string;
  mime: string;
}

// i use this file to store hex signatures for common file types. 
export const MAGIC_NUMBERS: Record<string, FileType> = {
  "89504e47": { extension: "png", mime: "image/png" },
  "ffd8ffe0": { extension: "jpg", mime: "image/jpeg" },
  "ffd8ffe1": { extension: "jpg", mime: "image/jpeg" },
  "ffd8ffe2": { extension: "jpg", mime: "image/jpeg" },
  "25504446": { extension: "pdf", mime: "application/pdf" },
};