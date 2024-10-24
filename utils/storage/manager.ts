'use client'; 
import { StorageUsers } from "./constants";

const USER_KEY = "userName";

export default class StorageManager  {

    static selectUser(userName: StorageUsers) {
        window.localStorage.setItem(USER_KEY, userName);
    }

    static getSelectedUser() {
        return window.localStorage.getItem(USER_KEY);
    }

    static isUserLogged() {
        return StorageManager.getSelectedUser() !== null;
    }

    static removeSelectedUser() {
        window.localStorage.removeItem(USER_KEY);
    }
}