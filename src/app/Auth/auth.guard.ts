import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
 
@Injectable()
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router, @Inject(SESSION_STORAGE) private storage: StorageService) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.storage.get('loggedIn')) {
            // logged in so return true
            return true;
        }
 
        // not logged in so redirect to login page with the return url
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}