import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, Observable, throwError} from 'rxjs';
import {OrderService} from "./order.service";
import {Order, OrderResponse, WeddingInformation} from "./order.types";
import {Category} from "../category/category.types";
import {Discount, DiscountResponse} from "../discount/discount.types";
import {Account} from "../user/user.types";

@Injectable({
    providedIn: 'root'
})
export class WeddingsServiceResolver implements Resolve<any> {
    constructor(private _service: OrderService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WeddingInformation[]> {
        return this._service.getAllWeddingInformations();
    }
}

@Injectable({
    providedIn: 'root'
})
export class VouchersResolver implements Resolve<any> {
    constructor(private _service: OrderService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Discount[]> {
        return this._service.getAllDiscounts();
    }
}

@Injectable({
    providedIn: 'root'
})
export class OrderUsersResolver implements Resolve<any> {
    constructor(private _service: OrderService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Account[]> {
        return this._service.getUsers();
    }
}

@Injectable({
    providedIn: 'root'
})
export class OrderResolver implements Resolve<any> {
    constructor(
        private _service: OrderService,
        private _router: Router
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order> {
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
export class PendingOrdersResolver implements Resolve<any> {
    constructor(private _service: OrderService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OrderResponse> {
        return this._service.getPendingItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class DoingOrdersResolver implements Resolve<any> {
    constructor(private _service: OrderService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OrderResponse> {
        return this._service.getDoingItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class DoneOrdersResolver implements Resolve<any> {
    constructor(private _service: OrderService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OrderResponse> {
        return this._service.getDoneItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CancelledOrdersResolver implements Resolve<any> {
    constructor(private _service: OrderService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OrderResponse> {
        return this._service.getCancelledItems();
    }
}
