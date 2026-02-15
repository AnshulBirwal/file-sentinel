# File Sentinel

A secure, client-side web application built with React and Vite that detects spoofed file extensions. This tool verifies the true identity of a file by analyzing its internal byte signature directly in the browser, ensuring user data never leaves the device.

## The Principle: Magic Numbers

Files are often identified by their extensions (e.g., `document.pdf` or `image.jpg`), but an extension is just a naming convention. A malicious actor can easily rename `virus.exe` to `receipt.pdf` to trick a user into executing it.

To determine a file's true format, this application reads its "Magic Numbers." Magic numbers are a constant sequence of hidden bytes located at the very beginning of a file. 



For example:
* A valid PDF file always starts with the hexadecimal bytes `25 50 44 46` (which translates to the ASCII characters `%PDF`).
* A JPEG image always starts with `FF D8 FF`.

**How this app works:**
1. The user selects a file.
2. The browser's native `FileReader` API extracts only the first 12 bytes of the file. (Reading only a tiny slice ensures the app remains instantaneous, even for 10GB files).
3. These bytes are converted to a hexadecimal string.
4. The hex string is cross-referenced against an internal dictionary of known file signatures.
5. The detected internal signature is compared against the user-facing file extension. If they do not match, the application flags the file as spoofed.

### Handling Edge Cases
The detection engine includes advanced parsing for container formats:
* **ZIP Containers:** Modern Microsoft Office documents (`.docx`, `.xlsx`) and OpenDocument formats (`.odt`) are natively recognized as ZIP archives under the hood. The engine correctly validates these without throwing false positives.
* **RIFF Containers:** Media formats like `.wav`, `.avi`, and `.webp` share a common `RIFF` header. The engine parses the secondary identifier chunk (bytes 8-11) to extract the exact media type.

## Features

* **100% Client-Side:** Files are processed locally in the browser. Zero server uploads mean total privacy and security.
* **Instant Analysis:** By reading only the file header, analysis takes milliseconds regardless of file size.
* **Robust Edge-Case Handling:** Safely identifies container-based file formats and standard extension variations.

## Tech Stack

* React (Functional Components & Hooks)
* TypeScript
* Vite
* GitHub Pages (Deployment)

## Local Development

To run this project locally, clone the repository and run the following commands:

```bash
# Install dependencies
npm install

# Start the local development server
npm run dev