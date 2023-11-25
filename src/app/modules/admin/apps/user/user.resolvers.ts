import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, Observable, throwError} from 'rxjs';
import {UserService} from "./user.service";
import {Account, AccountResponse} from "./user.types";
import {Category, CategoryResponse} from "../category/category.types";

// @Injectable({
//     providedIn: 'root'
// })
// export class UserResolver implements Resolve<any> {
//     constructor(
//         private _service: UserService,
//         private _router: Router
//     ) {
//     }
//
//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Account> {
//         return this._service.getItem(route.paramMap.get('id'))
//             .pipe(
//                 // Error here means the requested product is not available
//                 catchError((error) => {
//
//                     // Log the error
//                     console.error(error);
//
//                     // Get the parent url
//                     const parentUrl = state.url.split('/').slice(0, -1).join('/');
//
//                     // Navigate to there
//                     this._router.navigateByUrl(parentUrl);
//
//                     // Throw an error
//                     return throwError(error);
//                 })
//             );
//     }
// }

@Injectable({
    providedIn: 'root'
})
export class OwnerUsersResolver implements Resolve<any> {
    constructor(private _service: UserService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AccountResponse> {
        return this._service.getOwnerItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PartnerUsersResolver implements Resolve<any> {
    constructor(private _service: UserService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AccountResponse> {
        return this._service.getPartnerItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class StaffUsersResolver implements Resolve<any> {
    constructor(private _service: UserService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AccountResponse> {
        return this._service.getStaffItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CustomerUsersResolver implements Resolve<any> {
    constructor(private _service: UserService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AccountResponse> {
        return this._service.getCustomerItems();
    }
}

// @Injectable({
//     providedIn: 'root'
// })
// export class UsersResolver implements Resolve<any> {
//     constructor(private _service: UserService) {
//     }
//
//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AccountResponse> {
//         return this._service.getItems();
//     }
// }

@Injectable({
    providedIn: 'root'
})
export class CategoriesResolver implements Resolve<any> {
    constructor(private _service: UserService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category[]> {
        return this._service.getAllCategories();
    }
}
