
import { ElementRef } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { enc, mode } from 'crypto-js';
import { Renderer2} from '@angular/core';
export default class Utils {
  static  SECRET_KEY = "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F";
  static IV = "202122232425262728292A2B2C2D2E2F";


    static EvaluaQuery(queryEncrypt: string, rowIndex: string, nameOfTable: string) {
          return Utils.decrypt(queryEncrypt);
    }

    static hideControl( nameControl: string , renderer: Renderer2) {
      renderer.addClass(renderer.selectRootElement('#' + nameControl, true), 'hidden');
    }

    static disableTab( nameControl: string , renderer: Renderer2) {
      renderer.addClass(renderer.selectRootElement('#' + nameControl, true), 'disableDiv');
    }
    static enableTab( nameControl: string , renderer: Renderer2) {
      renderer.removeClass(renderer.selectRootElement('#' + nameControl, true), 'disableDiv');
    }

    static showControl( nameControl: string , renderer: Renderer2) {
      renderer.removeClass(renderer.selectRootElement('#' + nameControl, true), 'hidden');
    }


    static decrypt(data) {
      const hex = CryptoJS.enc.Hex.parse(data);
      const key = CryptoJS.enc.Hex.parse(Utils.SECRET_KEY);
      const iv = CryptoJS.enc.Hex.parse(Utils.IV);
      const word: CryptoJS.WordArray = {ciphertext: hex, iv, salt: ''};
      const encrypted = CryptoJS.AES.decrypt(word, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
      return encrypted.toString(CryptoJS.enc.Utf8);
      }

      static encrypt(data) {
        const key = CryptoJS.enc.Hex.parse(Utils.SECRET_KEY);
        const iv = CryptoJS.enc.Hex.parse(Utils.IV);
        const encrypted = CryptoJS.AES.encrypt(data, key, {
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });
        return encrypted.ciphertext.toString();
    }
}
