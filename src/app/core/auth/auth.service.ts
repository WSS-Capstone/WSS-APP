import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, from, Observable, of, switchMap, tap, throwError} from 'rxjs';
import {AuthUtils} from 'app/core/auth/auth.utils';
import {UserService} from 'app/core/user/user.service';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {ENDPOINTS} from "../global.constants";
import {User} from "../user/user.types";
import {Auth, GoogleAuthProvider} from "@angular/fire/auth";
import {Router} from "@angular/router";

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;
    private _tempToken: string = '';

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _authFb: AngularFireAuth,
        private _router: Router,
        private _auth: Auth
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
        console.warn("token", token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    set role(role: string) {
        localStorage.setItem('role', role);
    }

    get role(): string {
        return localStorage.getItem('role') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('Bạn đã đăng nhập trước đó.');
        }

        return from(this._authFb.signInWithEmailAndPassword(credentials.email, credentials.password)).pipe(
            switchMap((response: any) => {
                return from(response.user.getIdToken()).pipe(
                    switchMap((token: any) => {
                        this._tempToken = token;
                        return this._httpClient.get(ENDPOINTS.userInfo, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                    }),
                    catchError((error) => {
                        return of(error);
                    })
                );
            }),
            switchMap((response: User) => {
                this.accessToken = this._tempToken;
                this._authenticated = true;
                response.avatar = response.owner?.imageUrl ?? response.partner?.imageUrl ?? response.customer?.imageUrl ?? response.staff?.imageUrl ?? '';
                response.name = response.owner?.fullname ?? response.partner?.fullname ?? response.customer?.fullname ?? response.staff?.fullname ?? '';
                response.email = response.username;
                this._userService.user = response;

                this.role = response.roleName;
                return of(response);
            })
        );
    }

    signInWithGoogle(): Observable<any> {
        const provider = new GoogleAuthProvider();
        return from(this._authFb.signInWithPopup(provider)).pipe(
            tap((response: any) => {
                console.log("response", response);
            }),
            switchMap((response: any) => {
                return from(response.user.getIdToken()).pipe(
                    switchMap((token: any) => {
                        this._tempToken = token;
                        return this._httpClient.get(ENDPOINTS.userInfo, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                    }),
                    catchError((error) => {
                        return of(error);
                    })
                );
            }),
            switchMap((response: User) => {
                this.accessToken = this._tempToken;
                this._authenticated = true;
                response.avatar = response.owner?.imageUrl ?? response.partner?.imageUrl ?? response.customer?.imageUrl ?? response.staff?.imageUrl ?? '';
                response.name = response.owner?.fullname ?? response.partner?.fullname ?? response.customer?.fullname ?? response.staff?.fullname ?? '';
                response.email = response.username;
                this._userService.user = response;
                this.role = response.roleName;
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        console.warn(" signInUsingToken ", this.accessToken);
        // Sign in using the token
        return this._httpClient.get(ENDPOINTS.userInfo, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`
            }
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                if (response.accessToken) {
                    this.accessToken = response.accessToken;
                }

                // Set the authenticated flag to true
                this._authenticated = true;
                response.avatar = response.owner?.imageUrl ?? response.partner?.imageUrl ?? response.customer?.imageUrl ?? response.staff?.imageUrl ?? '';
                response.name = response.owner?.fullname ?? response.partner?.fullname ?? response.customer?.fullname ?? response.staff?.fullname ?? '';
                response.email = response.username;
                // Store the user on the user service
                this._userService.user = response;
                this.role = response.roleName;
                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');

        // Set the authenticated flag to false
        this._authenticated = false;
        this._authFb.signOut();
        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
