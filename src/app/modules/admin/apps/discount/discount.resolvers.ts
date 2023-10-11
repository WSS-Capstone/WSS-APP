import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, Observable, throwError} from 'rxjs';
import {ComboService} from "./discount.service";
import {Discount, DiscountResponse} from "./discount.types";
import {Category} from "../category/category.types";

@Injectable({
    providedIn: 'root'
})
export class CategoriesServiceResolver implements Resolve<any> {
    constructor(private _service: ComboService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category[]> {
        return this._service.getAllCategories();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ComboResolver implements Resolve<any> {
    constructor(
        private _service: ComboService,
        private _router: Router
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Discount> {
        return this._service.getItem(route.paramMap.get('id'))
            .pipe(
                // Error here means the requested product is not available
                catchError((error) => {

                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url.split('/').slice(0, -1).join('/');

                    // Navigate to there
                    this._router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}

@Injectable({
    providedIn: 'root'
})
export class CombosResolver implements Resolve<any> {
    constructor(private _service: ComboService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DiscountResponse> {
        return this._service.getItems();
    }
}
