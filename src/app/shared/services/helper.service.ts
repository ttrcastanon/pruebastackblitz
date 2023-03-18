import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

 /* showNotification(colorName, text, placementFrom, placementAlign ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }*/

  base64ToArrayBuffer(base64: any) {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
       const ascii = binaryString.charCodeAt(i);
       bytes[i] = ascii;
    }
    return bytes;
 }
 dowloadFile(base64: string, fileName: string) {
  const blob = new Blob([new Uint8Array(this.base64ToArrayBuffer(base64))], { type: 'image/jpeg' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();

}
dowloadFileFromArray(arrayBuffer: any[], fileName: string) {
  const blob = new Blob([new Uint8Array(arrayBuffer)], { type: 'image/jpeg' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();

}

fileToByteArray(file): Promise<any[]> {
  return new Promise((resolve, reject) => {
      try {
          const reader = new FileReader();
          const fileByteArray = [];
          reader.readAsArrayBuffer(file);
          reader.onload = (evt) => {
              if (evt.target.readyState === FileReader.DONE) {
                  const arrayBuffer = reader.result;
                  const array = new Uint8Array(arrayBuffer as ArrayBuffer);
                  for (const byte of array) {
                      fileByteArray.push(byte);
                  }
              }
              resolve(fileByteArray);
          };
      }
      catch (e) {
          reject(e);
      }
  });
}

}
