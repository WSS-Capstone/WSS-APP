import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, Observable, throwError} from 'rxjs';
import {DiscountService} from "./discount.service";
import {Discount, DiscountResponse} from "./discount.types";
import {Category} from "../category/category.types";

@Injectable({
    providedIn: 'root'
})
export class CategoriesDiscountResolver implements Resolve<any> {
    constructor(private _service: DiscountService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category[]> {
        return this._service.getAllCategories();
    }
}

@Injectable({
    providedIn: 'root'
})
export class DiscountResolver implements Resolve<any> {
    constructor(
        private _service: DiscountService,
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
export class DiscountsResolver implements Resolve<any> {
    constructor(private _service: DiscountService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DiscountResponse> {
        return this._service.getItems();
    }
}
