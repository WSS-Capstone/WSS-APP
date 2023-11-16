import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, Observable, throwError} from 'rxjs';
import {TaskService} from "./task.service";
import {Task, TaskResponse} from "./task.types";
import {Category} from "../category/category.types";

@Injectable({
    providedIn: 'root'
})
export class CategoriesTaskResolver implements Resolve<any> {
    constructor(private _service: TaskService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category[]> {
        return this._service.getAllCategories();
    }
}

@Injectable({
    providedIn: 'root'
})
export class OwnerTaskResolver implements Resolve<any> {
    constructor(
        private _service: TaskService,
        private _router: Router
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task> {
        return this._service.getOwnerItem(route.paramMap.get('id'))
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
export class PartnerTaskResolver implements Resolve<any> {
    constructor(
        private _service: TaskService,
        private _router: Router
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task> {
        return this._service.getPartnerItem(route.paramMap.get('id'))
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
export class OwnerTasksResolver implements Resolve<any> {
    constructor(private _service: TaskService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskResponse> {
        return this._service.getOwnerItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PartnerTasksResolver implements Resolve<any> {
    constructor(private _service: TaskService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskResponse> {
        return this._service.getPartnerItems();
    }
}
