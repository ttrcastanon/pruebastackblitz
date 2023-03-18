import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

const SecureStorage = require('secure-web-storage');
const SECRET_KEY = 'Ber1g0';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
 
  constructor() { }
  public secureStorage = new SecureStorage(localStorage, {
    hash: function hash(key) {
      key = CryptoJS.SHA256(key, SECRET_KEY);
      return key.toString();
    },
    encrypt: function encrypt(data) {
      return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();

    },
    decrypt: function decrypt(data) {
      return CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    }
  });
}
