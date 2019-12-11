import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class CanActivateAdminGuard implements CanActivate {
    constructor() {
    }

    canActivate() {
        if (localStorage.getItem('USER_ID') !== undefined) {
            return true;
        } else {
            false;
        }
    }
}