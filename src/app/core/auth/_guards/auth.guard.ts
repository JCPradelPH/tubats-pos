// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { Observable } from 'rxjs';
import { tap, first, map } from 'rxjs/operators';
// NGRX
import { select, Store } from '@ngrx/store';
// Auth reducers and selectors
import { AppState} from '../../../core/reducers/';
import { isLoggedIn, currentUser } from '../_selectors/auth.selectors';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private store: Store<AppState>, private router: Router, private firebaseAuth: AngularFireAuth) {
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {
        // return this.firebaseAuth.authState.pipe(
        //     first(),
        //     map((user) => {
        //         if (!user) {
        //             this.router.navigateByUrl('/auth/login');
        //             return false;
        //         }
        //         this.router.navigateByUrl('/');
        //     })
        // );
        // .subscribe(user => {
        //     if (!user) {
        //         this.router.navigateByUrl('/auth/login');
        //         return false;
        //     }
        //     return true;
        // },
        // err => {
        //     console.log(`AuthGuard error: ${err}`);
        //     return false;
        // });
        return this.store
            .pipe(
                select(isLoggedIn),
                tap(loggedIn => {
                    if (!loggedIn) {
                        this.router.navigateByUrl('/auth/login');
                    }
                })
            );
    }
}
