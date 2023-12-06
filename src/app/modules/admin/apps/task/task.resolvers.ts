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

// @Injectable({
//     providedIn: 'root'
// })
// export class OwnerTaskResolver implements Resolve<any> {
//     constructor(
//         private _service: TaskService,
//         private _router: Router
//     ) {
//     }
//
//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task> {
//         return this._service.getOwnerItem(route.paramMap.get('id'))
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

// @Injectable({
//     providedIn: 'root'
// })
// export class PartnerTaskResolver implements Resolve<any> {
//     constructor(
//         private _service: TaskService,
//         private _router: Router
//     ) {
//     }
//
//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task> {
//         return this._service.getPartnerItem(route.paramMap.get('id'))
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
export class OwnerExpectedTasksResolver implements Resolve<any> {
    constructor(private _service: TaskService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskResponse> {
        return this._service.getOwnerExpectedItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class OwnerToDoTasksResolver implements Resolve<any> {
    constructor(private _service: TaskService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskResponse> {
        return this._service.getOwnerToDoItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class OwnerInProgressTasksResolver implements Resolve<any> {
    constructor(private _service: TaskService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskResponse> {
        return this._service.getOwnerInProgressItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class OwnerCancelTasksResolver implements Resolve<any> {
    constructor(private _service: TaskService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskResponse> {
        return this._service.getOwnerCancelItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class OwnerDoneTasksResolver implements Resolve<any> {
    constructor(private _service: TaskService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskResponse> {
        return this._service.getOwnerDoneItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PartnerExpectedTasksResolver implements Resolve<any> {
    constructor(private _service: TaskService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskResponse> {
        return this._service.getPartnerExpectedItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PartnerToDoTasksResolver implements Resolve<any> {
    constructor(private _service: TaskService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskResponse> {
        return this._service.getPartnerToDoItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PartnerInProgressTasksResolver implements Resolve<any> {
    constructor(private _service: TaskService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskResponse> {
        return this._service.getPartnerInProgressItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PartnerDoneTasksResolver implements Resolve<any> {
    constructor(private _service: TaskService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskResponse> {
        return this._service.getPartnerDoneItems();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PartnerCancelTasksResolver implements Resolve<any> {
    constructor(private _service: TaskService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskResponse> {
        return this._service.getPartnerCancelItems();
    }
}
