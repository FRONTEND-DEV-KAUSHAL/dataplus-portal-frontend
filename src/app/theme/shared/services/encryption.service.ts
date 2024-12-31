// encryption.service.ts
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private key = CryptoJS.enc.Hex.parse(environment.encryptionKey); // Replace with your shared key
  private iv = CryptoJS.enc.Hex.parse(environment.encryptionKeyIV); // Replace with your shared IV
  // @example this.encryptionService.encrypt(taskData);
  encrypt(data: any): string {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), this.key, {
      iv: this.iv,
    }).toString();
    return encrypted;
  }

  // @example this.encryptionService.decrypt(encryptedResponse);
  decrypt(ciphertext: string): any {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.key, { iv: this.iv });
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }
}
