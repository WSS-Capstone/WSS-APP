import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate, CanMatch,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment,
    UrlTree
} from '@angular/router';
import {Observable, map, of, switchMap} from 'rxjs';
import {AuthService} from 'app/core/auth/auth.service';
import {UserService} from "../../user/user.service";

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanMatch {
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _userService: UserService,
        private _router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can match
     *
     * @param route
     * @param segments
     */
    canMatch(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        console.log("canMatch");
        return this._userService.user$.pipe(
            map((user) => {
console.log("user11", user);
                if (user.roleName === "Admin") {
                    const urlTree = this._router.parseUrl(`/admin/user`);
                    console.log("urlTree", route);
                    return urlTree;
                    // state.url = urlTree.toString();
                    // this._router.navigate(['/admin/user']);
                    // return this._router.createUrlTree(['/admin/user']);
                    // return true;
                }

                return true;
            })
        );
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this._userService.user$.pipe(
            map((user) => {

                if (user.roleName === "Admin") {
                    const urlTree = this._router.parseUrl(`/admin/user`);
                    console.log("urlTree", route);
                    return urlTree;
                    // state.url = urlTree.toString();
                    // this._router.navigate(['/admin/user']);
                    // return this._router.createUrlTree(['/admin/user']);
                    // return true;
                }

                return true;
            })
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param segments
     * @private
     */
    private _check(segments: UrlSegment[]): Observable<boolean | UrlTree>
    {
        // Check the authentication status
        return this._authService.check().pipe(
            switchMap((authenticated) => {

                // If the user is not authenticated...
                if ( !authenticated )
                {
                    // Redirect to the sign-in page with a redirectUrl param
                    const redirectURL = `/${segments.join('/')}`;
                    const urlTree = this._router.parseUrl(`sign-in?redirectURL=${redirectURL}`);

                    return of(urlTree);
                }

                // Allow the access
                return of(true);
            })
        );
    }
}
