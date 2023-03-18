import { LoggedUser } from '../models/logged-user';
import { StorageService } from '../shared/services/storage.service';
import { Injectable } from '@angular/core';

const LOGGED_USER = 'SPARTANE_LOGGED_USER';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageHelper {

    constructor(private storageService: StorageService) { }


    public setItemToLocalStorage(item: string, value: string) {
        this.storageService.secureStorage.setItem(item, value);
    }

    public getItemFromLocalStorage(item: string): string {
        return this.storageService.secureStorage.getItem(item);
    }

    public removeItemFromLocalStorage(item: string) {
        this.storageService.secureStorage.removeItem(item)
        //sessionStorage.removeItem(item);
    }
    public clearStorage() {
        return this.storageService.secureStorage.clear();
    }

    public setLoggedUserInfo(loggedUser: LoggedUser) {
        if (loggedUser === null) {
            sessionStorage.removeItem(LOGGED_USER);
        } else {
            const jsonData = JSON.stringify(loggedUser);
            this.storageService.secureStorage.setItem(LOGGED_USER, jsonData);
        }
    }

    public getLoggedUserInfo(): LoggedUser {
        const userInfo = this.storageService.secureStorage.getItem(LOGGED_USER);
        if (userInfo === null) {
            return null;
        }
        const loggedUser: LoggedUser = JSON.parse(userInfo);
        return loggedUser;
    }


    public setData(key: string, data: any) {
        const jsonData = JSON.stringify(data);
        this.storageService.secureStorage.setItem(key, jsonData);
    }

    public getData(key: string): any {
        const data = this.storageService.secureStorage.getItem(key);
        if (data === null) return null;
        return JSON.parse(data);
    }



}