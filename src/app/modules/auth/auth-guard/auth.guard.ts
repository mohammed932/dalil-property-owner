import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {
    status: any;
    constructor(private router: Router) {
    }
    handleGuard() {
        const token = localStorage.getItem('dalelTokenPropertyOwner');
        return token !== null ? true : this.router.navigateByUrl(`${localStorage.getItem('language')}/auth/login`);
    }

    canActivate() {
        return this.handleGuard();
    }
}