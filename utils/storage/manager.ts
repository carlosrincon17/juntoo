'use client'; 

import { StorageUsers } from "./constants";

const USER_KEY = "userName";

export default class StorageManager  {

    static selectUser(userName: StorageUsers) {
        if (typeof window !== "undefined")
            localStorage.setItem(USER_KEY, userName);
    }

    static getSelectedUser() {
        return localStorage.getItem(USER_KEY);
    }

    static isUserLogged() {
        return typeof window !== "undefined" && StorageManager.getSelectedUser() !== null;
    }

    static removeSelectedUser() {
        if (typeof window !== "undefined")
            localStorage.removeItem(USER_KEY);
    }
}