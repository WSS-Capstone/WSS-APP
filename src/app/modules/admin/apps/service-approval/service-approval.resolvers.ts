import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, Observable, throwError} from 'rxjs';
import {ApproveServiceService} from "./service-approval.service";
import {ApproveService, ApproveServiceResponse} from "./service-approval.types";
import {Category} from "../category/category.types";

@Injectable({
    providedIn: 'root'
})
export class CategoriesServiceResolver implements Resolve<any> {
    constructor(private _service: ApproveServiceService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category[]> {
        return this._service.getAllCategories();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ApproveServiceResolver implements Resolve<any> {
    constructor(
        private _service: ApproveServiceService,
        private _router: Router
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApproveService> {
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
export class ApproveServicesResolver implements Resolve<any> {
    constructor(private _service: ApproveServiceService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApproveServiceResponse> {
        return this._service.getItems();
    }
}
