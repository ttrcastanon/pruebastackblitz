export const base64ToArrayBuffer = (base64: string): Uint8Array => {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
       const ascii = binaryString.charCodeAt(i);
       bytes[i] = ascii;
    }
    return bytes;
 }

export const saveByteArray = (reportName: string, byte: Uint8Array, type: string) => {
  const blob = new Blob([byte], {type});
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  const fileName = reportName;
  link.download = fileName;
  link.click();
};

