import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError} from 'rxjs';
import {Comment, Task, TaskPagination, TaskResponse} from './task.types';
import {ENDPOINTS} from "../../../../core/global.constants";
import {Category, CategoryResponse, FileInfo} from "../category/category.types";
import {UserService} from "../../../../core/user/user.service";


@Injectable({
    providedIn: 'root'
})
export class TaskService {
    // Private
    private _selectedItem: BehaviorSubject<Task | null> = new BehaviorSubject(null);
    private _ownerExpectedItems: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _ownerToDoItems: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _ownerInProgressItems: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _ownerDoneItems: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _ownerCancelItems: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _partnerExpectedItems: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _partnerToDoItems: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _partnerInProgressItems: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _partnerDoneItems: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _partnerCancelItems: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _itemsCate: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _ownerExpectedPagination: BehaviorSubject<TaskPagination | null> = new BehaviorSubject(null);
    private _ownerToDoPagination: BehaviorSubject<TaskPagination | null> = new BehaviorSubject(null);
    private _ownerInProgressPagination: BehaviorSubject<TaskPagination | null> = new BehaviorSubject(null);
    private _ownerDonePagination: BehaviorSubject<TaskPagination | null> = new BehaviorSubject(null);
    private _ownerCancelPagination: BehaviorSubject<TaskPagination | null> = new BehaviorSubject(null);
    private _partnerExpectedPagination: BehaviorSubject<TaskPagination | null> = new BehaviorSubject(null);
    private _partnerToDoPagination: BehaviorSubject<TaskPagination | null> = new BehaviorSubject(null);
    private _partnerInProgressPagination: BehaviorSubject<TaskPagination | null> = new BehaviorSubject(null);
    private _partnerDonePagination: BehaviorSubject<TaskPagination | null> = new BehaviorSubject(null);
    private _partnerCancelPagination: BehaviorSubject<TaskPagination | null> = new BehaviorSubject(null);
    private user: any;
    constructor(private _httpClient: HttpClient, private _userService: UserService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get ownerExpectedPagination$(): Observable<TaskPagination> {
        return this._ownerExpectedPagination.asObservable();
    }

    get ownerToDoPagination$(): Observable<TaskPagination> {
        return this._ownerToDoPagination.asObservable();
    }

    get ownerInProgressPagination$(): Observable<TaskPagination> {
        return this._ownerInProgressPagination.asObservable();
    }

    get ownerDonePagination$(): Observable<TaskPagination> {
        return this._ownerDonePagination.asObservable();
    }

    get ownerCancelPagination$(): Observable<TaskPagination> {
        return this._ownerCancelPagination.asObservable();
    }

    get partnerExpectedPagination$(): Observable<TaskPagination> {
        return this._partnerExpectedPagination.asObservable();
    }

    get partnerToDoPagination$(): Observable<TaskPagination> {
        return this._partnerToDoPagination.asObservable();
    }

    get partnerInProgressPagination$(): Observable<TaskPagination> {
        return this._partnerInProgressPagination.asObservable();
    }

    get partnerDonePagination$(): Observable<TaskPagination> {
        return this._partnerDonePagination.asObservable();
    }

    get partnerCancelPagination$(): Observable<TaskPagination> {
        return this._partnerCancelPagination.asObservable();
    }

    get selectedItem$(): Observable<Task> {
        return this._selectedItem.asObservable();
    }

    get ownerExpectedItems$(): Observable<Task[]> {
        return this._ownerExpectedItems.asObservable();
    }

    get ownerToDoItems$(): Observable<Task[]> {
        return this._ownerToDoItems.asObservable();
    }

    get ownerInProgressItems$(): Observable<Task[]> {
        return this._ownerInProgressItems.asObservable();
    }

    get ownerDoneItems$(): Observable<Task[]> {
        return this._ownerDoneItems.asObservable();
    }

    get ownerCancelItems$(): Observable<Task[]> {
        return this._ownerCancelItems.asObservable();
    }

    get partnerExpectedItems$(): Observable<Task[]> {
        return this._partnerExpectedItems.asObservable();
    }

    get partnerToDoItems$(): Observable<Task[]> {
        return this._partnerToDoItems.asObservable();
    }

    get partnerInProgressItems$(): Observable<Task[]> {
        return this._partnerInProgressItems.asObservable();
    }

    get partnerDoneItems$(): Observable<Task[]> {
        return this._partnerDoneItems.asObservable();
    }

    get partnerCancelItems$(): Observable<Task[]> {
        return this._partnerCancelItems.asObservable();
    }

    get categories$(): Observable<Category[]> {
        return this._itemsCate.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get categories
     */
    getAllCategories(): Observable<Category[]> {
        return this._httpClient.get<CategoryResponse>(ENDPOINTS.category, {
            params: {
                'page-size': '' + 250,
                'status': 'Active'
            }
        }).pipe(
            tap((categories) => {
                console.log(categories);
                this._itemsCate.next(categories.data);
            }),
            map((categories) => {
                return categories.data;
            })
        );
    }


    getOwnerExpectedItems(page: number = 0, size: number = 10, sort: string = 'StartDate', order: 'asc' | 'desc' | '' = 'desc', search: string = ''):
        Observable<TaskResponse> {
        return this._httpClient.get<TaskResponse>(ENDPOINTS.task + '?ofPartner=false&status=EXPECTED', {
            params: {
                page: '' + (page),
                'page-size': '' + size,
                'sort-key': sort,
                'sort-order': 'DESC',
                taskName: search
            }
        }).pipe(
            tap((response) => {
                console.log(response);
                this._ownerExpectedPagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._ownerExpectedItems.next(response.data);
            })
        );
    }

    getOwnerToDoItems(page: number = 0, size: number = 10, sort: string = 'StartDate', order: 'asc' | 'desc' | '' = 'desc', search: string = ''):
        Observable<TaskResponse> {
        return this._httpClient.get<TaskResponse>(ENDPOINTS.task + '?ofPartner=false&status=TO_DO', {
            params: {
                page: '' + (page),
                'page-size': '' + size,
                'sort-key': sort,
                'sort-order': 'DESC',
                taskName: search
            }
        }).pipe(
            tap((response) => {
                console.log(response);
                this._ownerToDoPagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._ownerToDoItems.next(response.data);
            })
        );
    }

    getOwnerInProgressItems(page: number = 0, size: number = 10, sort: string = 'StartDate', order: 'asc' | 'desc' | '' = 'desc', search: string = ''):
        Observable<TaskResponse> {
        return this._httpClient.get<TaskResponse>(ENDPOINTS.task + '?ofPartner=false&status=IN_PROGRESS', {
            params: {
                page: '' + (page),
                'page-size': '' + size,
                'sort-key': sort,
                'sort-order': 'DESC',
                taskName: search
            }
        }).pipe(
            tap((response) => {
                console.log(response);
                this._ownerInProgressPagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._ownerInProgressItems.next(response.data);
            })
        );
    }

    getOwnerDoneItems(page: number = 0, size: number = 10, sort: string = 'StartDate', order: 'asc' | 'desc' | '' = 'desc', search: string = ''):
        Observable<TaskResponse> {
        return this._httpClient.get<TaskResponse>(ENDPOINTS.task + '?ofPartner=false&status=DONE', {
            params: {
                page: '' + (page),
                'page-size': '' + size,
                'sort-key': sort,
                'sort-order': 'DESC',
                taskName: search
            }
        }).pipe(
            tap((response) => {
                console.log(response);
                this._ownerDonePagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._ownerDoneItems.next(response.data);
            })
        );
    }

    getOwnerCancelItems(page: number = 0, size: number = 10, sort: string = 'StartDate', order: 'asc' | 'desc' | '' = 'desc', search: string = ''):
        Observable<TaskResponse> {
        return this._httpClient.get<TaskResponse>(ENDPOINTS.task + '?ofPartner=false&status=CANCEL', {
            params: {
                page: '' + (page),
                'page-size': '' + size,
                'sort-key': sort,
                'sort-order': 'DESC',
                taskName: search
            }
        }).pipe(
            tap((response) => {
                console.log(response);
                this._ownerCancelPagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._ownerCancelItems.next(response.data);
            })
        );
    }

    getPartnerExpectedItems(page: number = 0, size: number = 10, sort: string = 'StartDate', order: 'asc' | 'desc' | '' = 'desc', search: string = ''):
        Observable<TaskResponse> {
        return this._httpClient.get<TaskResponse>(ENDPOINTS.task + '?ofPartner=true&status=EXPECTED', {
            params: {
                page: '' + (page),
                'page-size': '' + size,
                'sort-key': sort,
                'sort-order': 'DESC',
                taskName: search
            }
        }).pipe(
            tap((response) => {
                console.log(response);
                this._partnerExpectedPagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._partnerExpectedItems.next(response.data);
            })
        );
    }

    getPartnerToDoItems(page: number = 0, size: number = 10, sort: string = 'StartDate', order: 'asc' | 'desc' | '' = 'desc', search: string = ''):
        Observable<TaskResponse> {
        return this._httpClient.get<TaskResponse>(ENDPOINTS.task + '?ofPartner=true&status=TO_DO', {
            params: {
                page: '' + (page),
                'page-size': '' + size,
                'sort-key': sort,
                'sort-order': 'DESC',
                taskName: search
            }
        }).pipe(
            tap((response) => {
                console.log(response);
                this._partnerToDoPagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._partnerToDoItems.next(response.data);
            })
        );
    }

    getPartnerInProgressItems(page: number = 0, size: number = 10, sort: string = 'StartDate', order: 'asc' | 'desc' | '' = 'desc', search: string = ''):
        Observable<TaskResponse> {
        return this._httpClient.get<TaskResponse>(ENDPOINTS.task + '?ofPartner=true&status=IN_PROGRESS', {
            params: {
                page: '' + (page),
                'page-size': '' + size,
                'sort-key': sort,
                'sort-order': 'DESC',
                taskName: search
            }
        }).pipe(
            tap((response) => {
                console.log(response);
                this._partnerInProgressPagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._partnerInProgressItems.next(response.data);
            })
        );
    }

    getPartnerDoneItems(page: number = 0, size: number = 10, sort: string = 'StartDate', order: 'asc' | 'desc' | '' = 'desc', search: string = ''):
        Observable<TaskResponse> {
        return this._httpClient.get<TaskResponse>(ENDPOINTS.task + '?ofPartner=true&status=DONE', {
            params: {
                page: '' + (page),
                'page-size': '' + size,
                'sort-key': sort,
                'sort-order': 'DESC',
                taskName: search
            }
        }).pipe(
            tap((response) => {
                console.log(response);
                this._partnerDonePagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._partnerDoneItems.next(response.data);
            })
        );
    }

    getPartnerCancelItems(page: number = 0, size: number = 10, sort: string = 'StartDate', order: 'asc' | 'desc' | '' = 'desc', search: string = ''):
        Observable<TaskResponse> {
        return this._httpClient.get<TaskResponse>(ENDPOINTS.task + '?ofPartner=true&status=CANCEL', {
            params: {
                page: '' + (page),
                'page-size': '' + size,
                'sort-key': sort,
                'sort-order': 'DESC',
                taskName: search
            }
        }).pipe(
            tap((response) => {
                console.log(response);
                this._partnerCancelPagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._partnerCancelItems.next(response.data);
            })
        );
    }

    getItem(id: string, type: string): Observable<Task> {
        switch (type) {
            case 'owner_expected':
                return this._ownerExpectedItems.pipe(
                    take(1),
                    map((products) => {
                        const product = products.find(item => item.id === id) || null;
                        this._selectedItem.next(product);
                        return product;
                    }),
                    switchMap((product) => {
                        if (!product) {
                            return throwError('Could not found product with id of ' + id + '!');
                        }
                        return of(product);
                    })
                );
            case 'owner__to_do':
                return this._ownerToDoItems.pipe(
                    take(1),
                    map((products) => {
                        const product = products.find(item => item.id === id) || null;
                        this._selectedItem.next(product);
                        return product;
                    }),
                    switchMap((product) => {
                        if (!product) {
                            return throwError('Could not found product with id of ' + id + '!');
                        }
                        return of(product);
                    })
                );
            case 'owner__in_progress':
                return this._ownerInProgressItems.pipe(
                    take(1),
                    map((products) => {
                        const product = products.find(item => item.id === id) || null;
                        this._selectedItem.next(product);
                        return product;
                    }),
                    switchMap((product) => {
                        if (!product) {
                            return throwError('Could not found product with id of ' + id + '!');
                        }
                        return of(product);
                    })
                );
            case 'owner_done':
                return this._ownerDoneItems.pipe(
                    take(1),
                    map((products) => {
                        const product = products.find(item => item.id === id) || null;
                        this._selectedItem.next(product);
                        return product;
                    }),
                    switchMap((product) => {
                        if (!product) {
                            return throwError('Could not found product with id of ' + id + '!');
                        }
                        return of(product);
                    })
                );
            case 'owner_cancel':
                return this._ownerCancelItems.pipe(
                    take(1),
                    map((products) => {
                        const product = products.find(item => item.id === id) || null;
                        this._selectedItem.next(product);
                        return product;
                    }),
                    switchMap((product) => {
                        if (!product) {
                            return throwError('Could not found product with id of ' + id + '!');
                        }
                        return of(product);
                    })
                );
            case 'partner_expected':
                return this._partnerExpectedItems.pipe(
                    take(1),
                    map((products) => {
                        const product = products.find(item => item.id === id) || null;
                        this._selectedItem.next(product);
                        return product;
                    }),
                    switchMap((product) => {
                        if (!product) {
                            return throwError('Could not found product with id of ' + id + '!');
                        }
                        return of(product);
                    })
                );
            case 'partner__to_do':
                return this._partnerToDoItems.pipe(
                    take(1),
                    map((products) => {
                        const product = products.find(item => item.id === id) || null;
                        this._selectedItem.next(product);
                        return product;
                    }),
                    switchMap((product) => {
                        if (!product) {
                            return throwError('Could not found product with id of ' + id + '!');
                        }
                        return of(product);
                    })
                );
            case 'partner__in_progress':
                return this._partnerInProgressItems.pipe(
                    take(1),
                    map((products) => {
                        const product = products.find(item => item.id === id) || null;
                        this._selectedItem.next(product);
                        return product;
                    }),
                    switchMap((product) => {
                        if (!product) {
                            return throwError('Could not found product with id of ' + id + '!');
                        }
                        return of(product);
                    })
                );
            case 'partner_done':
                return this._partnerDoneItems.pipe(
                    take(1),
                    map((products) => {
                        const product = products.find(item => item.id === id) || null;
                        this._selectedItem.next(product);
                        return product;
                    }),
                    switchMap((product) => {
                        if (!product) {
                            return throwError('Could not found product with id of ' + id + '!');
                        }
                        return of(product);
                    })
                );
            case 'partner_cancel':
                return this._partnerCancelItems.pipe(
                    take(1),
                    map((products) => {
                        const product = products.find(item => item.id === id) || null;
                        this._selectedItem.next(product);
                        return product;
                    }),
                    switchMap((product) => {
                        if (!product) {
                            return throwError('Could not found product with id of ' + id + '!');
                        }
                        return of(product);
                    })
                );
        }
    }

    updateTask(id: string, item: any, currentStatus: number, newStatus: number): Observable<Task> {
        switch (currentStatus) {
            case 0:
                return this.ownerExpectedItems$.pipe(
                    take(1),
                    switchMap(itemsArr => this._httpClient.put<Task>(ENDPOINTS.task + `/${id}`, {
                        ...item
                    }).pipe(
                        map((updatedItem) => {
                            const index = itemsArr.findIndex(item => item.id === id);
                            itemsArr[index] = updatedItem;
                            switch (newStatus) {
                                case 1:
                                    this._ownerToDoItems.value.length > 0
                                        ? this._ownerToDoItems.next([itemsArr[index], ...this._ownerToDoItems.value])
                                        : this._ownerToDoItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 2:
                                    this._ownerInProgressItems.value.length > 0
                                        ? this._ownerInProgressItems.next([itemsArr[index], ...this._ownerInProgressItems.value])
                                        : this._ownerInProgressItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 3:
                                    this._ownerDoneItems.value.length > 0
                                        ? this._ownerDoneItems.next([itemsArr[index], ...this._ownerDoneItems.value])
                                        : this._ownerDoneItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                            }
                            this._ownerExpectedItems.next(itemsArr);
                            return updatedItem;
                        }),
                        switchMap(updatedItem => this.selectedItem$.pipe(
                            take(1),
                            filter(item => item && item.id === id),
                            tap(() => {
                                this._selectedItem.next(updatedItem);
                                return updatedItem;
                            })
                        ))
                    ))
                );
            case 1:
                return this.ownerToDoItems$.pipe(
                    take(1),
                    switchMap(itemsArr => this._httpClient.put<Task>(ENDPOINTS.task + `/${id}`, {
                        ...item
                    }).pipe(
                        map((updatedItem) => {
                            const index = itemsArr.findIndex(item => item.id === id);
                            itemsArr[index] = updatedItem;
                            switch (newStatus) {
                                case 0:
                                    this._ownerExpectedItems.value.length > 0
                                        ? this._ownerExpectedItems.next([itemsArr[index], ...this._ownerExpectedItems.value])
                                        : this._ownerExpectedItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 2:
                                    this._ownerInProgressItems.value.length > 0
                                        ? this._ownerInProgressItems.next([itemsArr[index], ...this._ownerInProgressItems.value])
                                        : this._ownerInProgressItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 3:
                                    this._ownerDoneItems.value.length > 0
                                        ? this._ownerDoneItems.next([itemsArr[index], ...this._ownerDoneItems.value])
                                        : this._ownerDoneItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                            }
                            this._ownerToDoItems.next(itemsArr);
                            return updatedItem;
                        }),
                        switchMap(updatedItem => this.selectedItem$.pipe(
                            take(1),
                            filter(item => item && item.id === id),
                            tap(() => {
                                this._selectedItem.next(updatedItem);
                                return updatedItem;
                            })
                        ))
                    ))
                );
            case 2:
                return this.ownerInProgressItems$.pipe(
                    take(1),
                    switchMap(itemsArr => this._httpClient.put<Task>(ENDPOINTS.task + `/${id}`, {
                        ...item
                    }).pipe(
                        map((updatedItem) => {
                            const index = itemsArr.findIndex(item => item.id === id);
                            itemsArr[index] = updatedItem;
                            switch (newStatus) {
                                case 0:
                                    this._ownerExpectedItems.value.length > 0
                                        ? this._ownerExpectedItems.next([itemsArr[index], ...this._ownerExpectedItems.value])
                                        : this._ownerExpectedItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 1:
                                    this._ownerToDoItems.value.length > 0
                                        ? this._ownerToDoItems.next([itemsArr[index], ...this._ownerToDoItems.value])
                                        : this._ownerToDoItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 3:
                                    this._ownerDoneItems.value.length > 0
                                        ? this._ownerDoneItems.next([itemsArr[index], ...this._ownerDoneItems.value])
                                        : this._ownerDoneItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                            }
                            this._ownerInProgressItems.next(itemsArr);
                            return updatedItem;
                        }),
                        switchMap(updatedItem => this.selectedItem$.pipe(
                            take(1),
                            filter(item => item && item.id === id),
                            tap(() => {
                                this._selectedItem.next(updatedItem);
                                return updatedItem;
                            })
                        ))
                    ))
                );
            case 3:
                return this.ownerDoneItems$.pipe(
                    take(1),
                    switchMap(itemsArr => this._httpClient.put<Task>(ENDPOINTS.task + `/${id}`, {
                        ...item
                    }).pipe(
                        map((updatedItem) => {
                            const index = itemsArr.findIndex(item => item.id === id);
                            itemsArr[index] = updatedItem;
                            switch (newStatus) {
                                case 0:
                                    this._ownerExpectedItems.value.length > 0
                                        ? this._ownerExpectedItems.next([itemsArr[index], ...this._ownerExpectedItems.value])
                                        : this._ownerExpectedItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 1:
                                    this._ownerToDoItems.value.length > 0
                                        ? this._ownerToDoItems.next([itemsArr[index], ...this._ownerToDoItems.value])
                                        : this._ownerToDoItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 2:
                                    this._ownerInProgressItems.value.length > 0
                                        ? this._ownerInProgressItems.next([itemsArr[index], ...this._ownerInProgressItems.value])
                                        : this._ownerInProgressItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                            }
                            this._ownerDoneItems.next(itemsArr);
                            return updatedItem;
                        }),
                        switchMap(updatedItem => this.selectedItem$.pipe(
                            take(1),
                            filter(item => item && item.id === id),
                            tap(() => {
                                this._selectedItem.next(updatedItem);
                                return updatedItem;
                            })
                        ))
                    ))
                );
        }
    }

    updateTaskPartner(id: string, item: any, currentStatus: number, newStatus: number): Observable<Task> {
        switch (currentStatus) {
            case 0:
                return this.partnerExpectedItems$.pipe(
                    take(1),
                    switchMap(itemsArr => this._httpClient.put<Task>(ENDPOINTS.task + `/${id}`, {
                        ...item
                    }).pipe(
                        map((updatedItem) => {
                            const index = itemsArr.findIndex(item => item.id === id);
                            itemsArr[index] = updatedItem;
                            switch (newStatus) {
                                case 1:
                                    this._partnerToDoItems.value.length > 0
                                        ? this._partnerToDoItems.next([itemsArr[index], ...this._partnerToDoItems.value])
                                        : this._partnerToDoItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 2:
                                    this._partnerInProgressItems.value.length > 0
                                        ? this._partnerInProgressItems.next([itemsArr[index], ...this._partnerInProgressItems.value])
                                        : this._partnerInProgressItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 3:
                                    this._partnerDoneItems.value.length > 0
                                        ? this._partnerDoneItems.next([itemsArr[index], ...this._partnerDoneItems.value])
                                        : this._partnerDoneItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                            }
                            this._partnerExpectedItems.next(itemsArr);
                            return updatedItem;
                        }),
                        switchMap(updatedItem => this.selectedItem$.pipe(
                            take(1),
                            filter(item => item && item.id === id),
                            tap(() => {
                                this._selectedItem.next(updatedItem);
                                return updatedItem;
                            })
                        ))
                    ))
                );
            case 1:
                return this.partnerToDoItems$.pipe(
                    take(1),
                    switchMap(itemsArr => this._httpClient.put<Task>(ENDPOINTS.task + `/${id}`, {
                        ...item
                    }).pipe(
                        map((updatedItem) => {
                            const index = itemsArr.findIndex(item => item.id === id);
                            itemsArr[index] = updatedItem;
                            switch (newStatus) {
                                case 0:
                                    this._partnerExpectedItems.value.length > 0
                                        ? this._partnerExpectedItems.next([itemsArr[index], ...this._partnerExpectedItems.value])
                                        : this._partnerExpectedItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 2:
                                    this._partnerInProgressItems.value.length > 0
                                        ? this._partnerInProgressItems.next([itemsArr[index], ...this._partnerInProgressItems.value])
                                        : this._partnerInProgressItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 3:
                                    this._partnerDoneItems.value.length > 0
                                        ? this._partnerDoneItems.next([itemsArr[index], ...this._partnerDoneItems.value])
                                        : this._partnerDoneItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                            }
                            this._partnerToDoItems.next(itemsArr);
                            return updatedItem;
                        }),
                        switchMap(updatedItem => this.selectedItem$.pipe(
                            take(1),
                            filter(item => item && item.id === id),
                            tap(() => {
                                this._selectedItem.next(updatedItem);
                                return updatedItem;
                            })
                        ))
                    ))
                );
            case 2:
                return this.partnerInProgressItems$.pipe(
                    take(1),
                    switchMap(itemsArr => this._httpClient.put<Task>(ENDPOINTS.task + `/${id}`, {
                        ...item
                    }).pipe(
                        map((updatedItem) => {
                            const index = itemsArr.findIndex(item => item.id === id);
                            itemsArr[index] = updatedItem;
                            switch (newStatus) {
                                case 0:
                                    this._partnerExpectedItems.value.length > 0
                                        ? this._partnerExpectedItems.next([itemsArr[index], ...this._partnerExpectedItems.value])
                                        : this._partnerExpectedItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 1:
                                    this._partnerToDoItems.value.length > 0
                                        ? this._partnerToDoItems.next([itemsArr[index], ...this._partnerToDoItems.value])
                                        : this._partnerToDoItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 3:
                                    this._partnerDoneItems.value.length > 0
                                        ? this._partnerDoneItems.next([itemsArr[index], ...this._partnerDoneItems.value])
                                        : this._partnerDoneItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                            }
                            this._partnerInProgressItems.next(itemsArr);
                            return updatedItem;
                        }),
                        switchMap(updatedItem => this.selectedItem$.pipe(
                            take(1),
                            filter(item => item && item.id === id),
                            tap(() => {
                                this._selectedItem.next(updatedItem);
                                return updatedItem;
                            })
                        ))
                    ))
                );
            case 3:
                return this.partnerDoneItems$.pipe(
                    take(1),
                    switchMap(itemsArr => this._httpClient.put<Task>(ENDPOINTS.task + `/${id}`, {
                        ...item
                    }).pipe(
                        map((updatedItem) => {
                            const index = itemsArr.findIndex(item => item.id === id);
                            itemsArr[index] = updatedItem;
                            switch (newStatus) {
                                case 0:
                                    this._partnerExpectedItems.value.length > 0
                                        ? this._partnerExpectedItems.next([itemsArr[index], ...this._partnerExpectedItems.value])
                                        : this._partnerExpectedItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 1:
                                    this._partnerToDoItems.value.length > 0
                                        ? this._partnerToDoItems.next([itemsArr[index], ...this._partnerToDoItems.value])
                                        : this._partnerToDoItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                                case 2:
                                    this._partnerInProgressItems.value.length > 0
                                        ? this._partnerInProgressItems.next([itemsArr[index], ...this._partnerInProgressItems.value])
                                        : this._partnerInProgressItems.next([itemsArr[index]]);
                                    itemsArr.slice(index, 1);
                                    break;
                            }
                            this._partnerDoneItems.next(itemsArr);
                            return updatedItem;
                        }),
                        switchMap(updatedItem => this.selectedItem$.pipe(
                            take(1),
                            filter(item => item && item.id === id),
                            tap(() => {
                                this._selectedItem.next(updatedItem);
                                return updatedItem;
                            })
                        ))
                    ))
                );
        }
    }

    delete(id: string, type: string): Observable<boolean> {
        switch (type) {
            case 'owner_expected':
                return this.ownerExpectedItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.delete(ENDPOINTS.task + `/${id}`, {params: {id}}).pipe(
                        map((isDeleted: boolean) => {
                            const index = items.findIndex(item => item.id === id);
                            items.splice(index, 1);
                            this._ownerExpectedItems.next(items);
                            return isDeleted;
                        })
                    ))
                );
            case 'owner__to_do':
                return this.ownerToDoItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.delete(ENDPOINTS.task + `/${id}`, {params: {id}}).pipe(
                        map((isDeleted: boolean) => {
                            const index = items.findIndex(item => item.id === id);
                            items.splice(index, 1);
                            this._ownerToDoItems.next(items);
                            return isDeleted;
                        })
                    ))
                );
            case 'owner__in_progress':
                return this.ownerInProgressItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.delete(ENDPOINTS.task + `/${id}`, {params: {id}}).pipe(
                        map((isDeleted: boolean) => {
                            const index = items.findIndex(item => item.id === id);
                            items.splice(index, 1);
                            this._ownerInProgressItems.next(items);
                            return isDeleted;
                        })
                    ))
                );
            case 'owner_done':
                return this.ownerDoneItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.delete(ENDPOINTS.task + `/${id}`, {params: {id}}).pipe(
                        map((isDeleted: boolean) => {
                            const index = items.findIndex(item => item.id === id);
                            items.splice(index, 1);
                            this._ownerDoneItems.next(items);
                            return isDeleted;
                        })
                    ))
                );
            case 'partner_expected':
                return this.partnerExpectedItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.delete(ENDPOINTS.task + `/${id}`, {params: {id}}).pipe(
                        map((isDeleted: boolean) => {
                            const index = items.findIndex(item => item.id === id);
                            items.splice(index, 1);
                            this._partnerExpectedItems.next(items);
                            return isDeleted;
                        })
                    ))
                );
            case 'partner__to_do':
                return this.partnerToDoItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.delete(ENDPOINTS.task + `/${id}`, {params: {id}}).pipe(
                        map((isDeleted: boolean) => {
                            const index = items.findIndex(item => item.id === id);
                            items.splice(index, 1);
                            this._partnerToDoItems.next(items);
                            return isDeleted;
                        })
                    ))
                );
            case 'partner__in_progress':
                return this.partnerInProgressItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.delete(ENDPOINTS.task + `/${id}`, {params: {id}}).pipe(
                        map((isDeleted: boolean) => {
                            const index = items.findIndex(item => item.id === id);
                            items.splice(index, 1);
                            this._partnerInProgressItems.next(items);
                            return isDeleted;
                        })
                    ))
                );
            case 'partner_done':
                return this.partnerDoneItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.delete(ENDPOINTS.task + `/${id}`, {params: {id}}).pipe(
                        map((isDeleted: boolean) => {
                            const index = items.findIndex(item => item.id === id);
                            items.splice(index, 1);
                            this._partnerDoneItems.next(items);
                            return isDeleted;
                        })
                    ))
                );
        }
    }

    uploadImage(data: File): Observable<string> {
        let formData = new FormData();
        formData.append('files', data);
        return this._httpClient.post<FileInfo[]>(ENDPOINTS.file, formData).pipe(
            map((res) => {
                return res[0].link;
            })
        );
    }

    addComment(id: string, content: string, type: string) {
        switch (type) {
            case 'owner_expected':
                return this.ownerExpectedItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.post<Comment>(ENDPOINTS.comment, {
                        taskId: id,
                        content: content
                    }).pipe(
                        map((comment: Comment) => {
                            const index = items.findIndex(item => item.id === id);
                            items[index].comments.push(comment)
                            this._ownerExpectedItems.next(items);
                            this._selectedItem.next(items[index]);
                        })
                    ))
                );
            case 'owner__to_do':
                return this.ownerToDoItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.post<Comment>(ENDPOINTS.comment, {
                        taskId: id,
                        content: content
                    }).pipe(
                        map((comment: Comment) => {
                            const index = items.findIndex(item => item.id === id);
                            items[index].comments.push(comment)
                            this._ownerToDoItems.next(items);
                            this._selectedItem.next(items[index]);
                        })
                    ))
                );
            case 'owner__in_progress':
                return this.ownerInProgressItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.post<Comment>(ENDPOINTS.comment, {
                        taskId: id,
                        content: content
                    }).pipe(
                        map((comment: Comment) => {
                            const index = items.findIndex(item => item.id === id);
                            items[index].comments.push(comment)
                            this._ownerInProgressItems.next(items);
                            this._selectedItem.next(items[index]);
                        })
                    ))
                );
            case 'owner_done':
                return this.ownerDoneItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.post<Comment>(ENDPOINTS.comment, {
                        taskId: id,
                        content: content
                    }).pipe(
                        map((comment: Comment) => {
                            const index = items.findIndex(item => item.id === id);
                            items[index].comments.push(comment)
                            this._ownerDoneItems.next(items);
                            this._selectedItem.next(items[index]);
                        })
                    ))
                );
            case 'owner_cancel':
                return this.ownerCancelItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.post<Comment>(ENDPOINTS.comment, {
                        taskId: id,
                        content: content
                    }).pipe(
                        map((comment: Comment) => {
                            const index = items.findIndex(item => item.id === id);
                            items[index].comments.push(comment)
                            this._ownerCancelItems.next(items);
                            this._selectedItem.next(items[index]);
                        })
                    ))
                );
            case 'partner_expected':
                return this.partnerExpectedItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.post<Comment>(ENDPOINTS.comment, {
                        taskId: id,
                        content: content
                    }).pipe(
                        map((comment: Comment) => {
                            const index = items.findIndex(item => item.id === id);
                            items[index].comments.push(comment)
                            this._partnerExpectedItems.next(items);
                            this._selectedItem.next(items[index]);
                        })
                    ))
                );
            case 'partner__to_do':
                return this.partnerToDoItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.post<Comment>(ENDPOINTS.comment, {
                        taskId: id,
                        content: content
                    }).pipe(
                        map((comment: Comment) => {
                            const index = items.findIndex(item => item.id === id);
                            items[index].comments.push(comment)
                            this._partnerToDoItems.next(items);
                            this._selectedItem.next(items[index]);
                        })
                    ))
                );
            case 'partner__in_progress':
                return this.partnerInProgressItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.post<Comment>(ENDPOINTS.comment, {
                        taskId: id,
                        content: content
                    }).pipe(
                        map((comment: Comment) => {
                            const index = items.findIndex(item => item.id === id);
                            items[index].comments.push(comment)
                            this._partnerInProgressItems.next(items);
                            this._selectedItem.next(items[index]);
                        })
                    ))
                );
            case 'partner_done':
                return this.partnerDoneItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.post<Comment>(ENDPOINTS.comment, {
                        taskId: id,
                        content: content
                    }).pipe(
                        map((comment: Comment) => {
                            const index = items.findIndex(item => item.id === id);
                            items[index].comments.push(comment)
                            this._partnerDoneItems.next(items);
                            this._selectedItem.next(items[index]);
                        })
                    ))
                );
            case 'partner_cancel':
                return this.partnerCancelItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.post<Comment>(ENDPOINTS.comment, {
                        taskId: id,
                        content: content
                    }).pipe(
                        map((comment: Comment) => {
                            const index = items.findIndex(item => item.id === id);
                            items[index].comments.push(comment)
                            this._partnerCancelItems.next(items);
                            this._selectedItem.next(items[index]);
                        })
                    ))
                );
        }
    }
}
