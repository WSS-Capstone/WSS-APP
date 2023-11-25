import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError} from 'rxjs';
import {Account, AccountPagination, AccountRequest, AccountResponse} from './user.types';
import {ENDPOINTS} from "../../../../core/global.constants";
import {Category, CategoryResponse, FileInfo} from "../category/category.types";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    // Private
    private _ownerItem: BehaviorSubject<Account | null> = new BehaviorSubject(null);
    private _ownerItems: BehaviorSubject<Account[] | null> = new BehaviorSubject(null);
    private _partnerItem: BehaviorSubject<Account | null> = new BehaviorSubject(null);
    private _partnerItems: BehaviorSubject<Account[] | null> = new BehaviorSubject(null);
    private _staffItem: BehaviorSubject<Account | null> = new BehaviorSubject(null);
    private _staffItems: BehaviorSubject<Account[] | null> = new BehaviorSubject(null);
    private _customerItem: BehaviorSubject<Account | null> = new BehaviorSubject(null);
    private _customerItems: BehaviorSubject<Account[] | null> = new BehaviorSubject(null);
    private _itemsCate: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _ownerPagination: BehaviorSubject<AccountPagination | null> = new BehaviorSubject(null);
    private _partnerPagination: BehaviorSubject<AccountPagination | null> = new BehaviorSubject(null);
    private _staffPagination: BehaviorSubject<AccountPagination | null> = new BehaviorSubject(null);
    private _customerPagination: BehaviorSubject<AccountPagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get ownerPagination$(): Observable<AccountPagination> {
        return this._ownerPagination.asObservable();
    }

    get partnerPagination$(): Observable<AccountPagination> {
        return this._partnerPagination.asObservable();
    }

    get staffPagination$(): Observable<AccountPagination> {
        return this._staffPagination.asObservable();
    }

    get customerPagination$(): Observable<AccountPagination> {
        return this._customerPagination.asObservable();
    }

    get ownerItem$(): Observable<Account> {
        return this._ownerItem.asObservable();
    }

    get ownerItems$(): Observable<Account[]> {
        return this._ownerItems.asObservable();
    }

    get partnerItem$(): Observable<Account> {
        return this._partnerItem.asObservable();
    }

    get partnerItems$(): Observable<Account[]> {
        return this._partnerItems.asObservable();
    }

    get staffItem$(): Observable<Account> {
        return this._staffItem.asObservable();
    }

    get staffItems$(): Observable<Account[]> {
        return this._staffItems.asObservable();
    }

    get customerItem$(): Observable<Account> {
        return this._customerItem.asObservable();
    }

    get customerItems$(): Observable<Account[]> {
        return this._customerItems.asObservable();
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


    getOwnerItems(page: number = 0, size: number = 10, sort: string = 'Status', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<AccountResponse> {
        return this._httpClient.get<AccountResponse>(ENDPOINTS.account + "?roleNames=Owner", {
            params: {
                page: '' + (page),
                'page-size': '' + size,
                'sort-key': sort,
                'sort-order': order,
                name: search
            }
        }).pipe(
            tap((response) => {
                console.log(response);
                this._ownerPagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._ownerItems.next(response.data);
            })
        );
    }

    getPartnerItems(page: number = 0, size: number = 10, sort: string = 'Status', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<AccountResponse> {
        return this._httpClient.get<AccountResponse>(ENDPOINTS.account + "?roleNames=Partner", {
            params: {
                page: '' + (page),
                'page-size': '' + size,
                'sort-key': sort,
                'sort-order': order,
                name: search
            }
        }).pipe(
            tap((response) => {
                console.log(response);
                this._partnerPagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._partnerItems.next(response.data);
            })
        );
    }

    getStaffItems(page: number = 0, size: number = 10, sort: string = 'Status', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<AccountResponse> {
        return this._httpClient.get<AccountResponse>(ENDPOINTS.account + "?roleNames=Staff", {
            params: {
                page: '' + (page),
                'page-size': '' + size,
                'sort-key': sort,
                'sort-order': order,
                name: search
            }
        }).pipe(
            tap((response) => {
                console.log(response);
                this._staffPagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._staffItems.next(response.data);
            })
        );
    }

    getCustomerItems(page: number = 0, size: number = 10, sort: string = 'Status', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<AccountResponse> {
        return this._httpClient.get<AccountResponse>(ENDPOINTS.account + "?roleNames=Customer", {
            params: {
                page: '' + (page),
                'page-size': '' + size,
                'sort-key': sort,
                'sort-order': order,
                name: search
            }
        }).pipe(
            tap((response) => {
                console.log(response);
                this._customerPagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._customerItems.next(response.data);
            })
        );
    }

    /**
     * Get product by id
     */
    getOwnerItem(id: string): Observable<Account> {
        return this._ownerItems.pipe(
            take(1),
            map((products) => {

                // Find the product
                const product = products.find(item => item.id === id) || null;

                // Update the product
                this._ownerItem.next(product);

                // Return the product
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

    getPartnerItem(id: string): Observable<Account> {
        return this._partnerItems.pipe(
            take(1),
            map((products) => {

                // Find the product
                const product = products.find(item => item.id === id) || null;

                // Update the product
                this._partnerItem.next(product);

                // Return the product
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

    getStaffItem(id: string): Observable<Account> {
        return this._staffItems.pipe(
            take(1),
            map((products) => {

                // Find the product
                const product = products.find(item => item.id === id) || null;

                // Update the product
                this._staffItem.next(product);

                // Return the product
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

    getCustomerItem(id: string): Observable<Account> {
        return this._customerItems.pipe(
            take(1),
            map((products) => {

                // Find the product
                const product = products.find(item => item.id === id) || null;

                // Update the product
                this._customerItem.next(product);

                // Return the product
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

    create(item: AccountRequest): Observable<Account> {
        item.phone = '+84' + item.phone;
        switch (item.roleName) {
            case 'Owner':
                return this.ownerItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.post<Account>(ENDPOINTS.account, item).pipe(
                        map((newItem) => {
                            this._ownerItems.next([newItem, ...items]);
                            return newItem;
                        })
                    ))
                );
            case 'Partner':
                return this.partnerItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.post<Account>(ENDPOINTS.account, item).pipe(
                        map((newItem) => {
                            this._partnerItems.next([newItem, ...items]);
                            return newItem;
                        })
                    ))
                );
            case 'Staff':
                return this.staffItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.post<Account>(ENDPOINTS.account, item).pipe(
                        map((newItem) => {
                            this._staffItems.next([newItem, ...items]);
                            return newItem;
                        })
                    ))
                );
            case 'Customer':
                return this.customerItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.post<Account>(ENDPOINTS.account, item).pipe(
                        map((newItem) => {
                            this._customerItems.next([newItem, ...items]);
                            return newItem;
                        })
                    ))
                );
        }
    }

    update(id: string, item: AccountRequest, currentRole: string): Observable<Account> {
        switch (currentRole) {
            case 'Owner':
                if(item.roleName === 'Staff') {
                    return this.ownerItems$.pipe(
                        take(1),
                        switchMap(itemsArr => this._httpClient.patch<Account>(ENDPOINTS.account, {
                            ...item
                        }).pipe(
                            map((updatedItem) => {
                                const index = itemsArr.findIndex(item => item.id === id);
                                itemsArr.splice(index, 1)
                                this._ownerItems.next(itemsArr);
                                this._staffItems.next([updatedItem, ...this._staffItems.value])
                                return updatedItem;
                            }),
                            switchMap(updatedItem => this.staffItem$.pipe(
                                take(1),
                                filter(item => item && item.id === id),
                                tap(() => {
                                    this._staffItem.next(updatedItem);
                                    return updatedItem;
                                })
                            ))
                        ))
                    );
                } else if(item.roleName === 'Partner') {
                    return this.ownerItems$.pipe(
                        take(1),
                        switchMap(itemsArr => this._httpClient.patch<Account>(ENDPOINTS.account, {
                            ...item
                        }).pipe(
                            map((updatedItem) => {
                                const index = itemsArr.findIndex(item => item.id === id);
                                itemsArr.splice(index, 1)
                                this._ownerItems.next(itemsArr);
                                this._partnerItems.next([updatedItem, ...this._partnerItems.value])
                                return updatedItem;
                            }),
                            switchMap(updatedItem => this.partnerItem$.pipe(
                                take(1),
                                filter(item => item && item.id === id),
                                tap(() => {
                                    this._partnerItem.next(updatedItem);
                                    return updatedItem;
                                })
                            ))
                        ))
                    );
                } else {
                    return this.ownerItems$.pipe(
                        take(1),
                        switchMap(itemsArr => this._httpClient.patch<Account>(ENDPOINTS.account, {
                            ...item
                        }).pipe(
                            map((updatedItem) => {
                                const index = itemsArr.findIndex(item => item.id === id);
                                itemsArr[index] = updatedItem;
                                this._ownerItems.next(itemsArr);
                                return updatedItem;
                            }),
                            switchMap(updatedItem => this.ownerItem$.pipe(
                                take(1),
                                filter(item => item && item.id === id),
                                tap(() => {
                                    this._ownerItem.next(updatedItem);
                                    return updatedItem;
                                })
                            ))
                        ))
                    );
                }
            case 'Partner':
                if(item.roleName === 'Staff') {
                    return this.partnerItems$.pipe(
                        take(1),
                        switchMap(itemsArr => this._httpClient.patch<Account>(ENDPOINTS.account, {
                            ...item
                        }).pipe(
                            map((updatedItem) => {
                                const index = itemsArr.findIndex(item => item.id === id);
                                itemsArr.splice(index, 1);
                                this._partnerItems.next(itemsArr);
                                this._staffItems.next([updatedItem, ...this._staffItems.value])
                                return updatedItem;
                            }),
                            switchMap(updatedItem => this.staffItem$.pipe(
                                take(1),
                                filter(item => item && item.id === id),
                                tap(() => {
                                    this._staffItem.next(updatedItem);
                                    return updatedItem;
                                })
                            ))
                        ))
                    );
                } else {
                    return this.partnerItems$.pipe(
                        take(1),
                        switchMap(itemsArr => this._httpClient.patch<Account>(ENDPOINTS.account, {
                            ...item
                        }).pipe(
                            map((updatedItem) => {
                                const index = itemsArr.findIndex(item => item.id === id);
                                itemsArr[index] = updatedItem;
                                this._partnerItems.next(itemsArr);
                                return updatedItem;
                            }),
                            switchMap(updatedItem => this.partnerItem$.pipe(
                                take(1),
                                filter(item => item && item.id === id),
                                tap(() => {
                                    this._partnerItem.next(updatedItem);
                                    return updatedItem;
                                })
                            ))
                        ))
                    );
                }
            case 'Staff':
                if(item.roleName === 'Partner') {
                    return this.staffItems$.pipe(
                        take(1),
                        switchMap(itemsArr => this._httpClient.patch<Account>(ENDPOINTS.account, {
                            ...item
                        }).pipe(
                            map((updatedItem) => {
                                const index = itemsArr.findIndex(item => item.id === id);
                                itemsArr.splice(index, 1);
                                this._staffItems.next(itemsArr);
                                this._partnerItems.next([updatedItem, ...this._partnerItems.value])
                                return updatedItem;
                            }),
                            switchMap(updatedItem => this.partnerItem$.pipe(
                                take(1),
                                filter(item => item && item.id === id),
                                tap(() => {
                                    this._partnerItem.next(updatedItem);
                                    return updatedItem;
                                })
                            ))
                        ))
                    );
                } else {
                    return this.staffItems$.pipe(
                        take(1),
                        switchMap(itemsArr => this._httpClient.patch<Account>(ENDPOINTS.account, {
                            ...item
                        }).pipe(
                            map((updatedItem) => {
                                const index = itemsArr.findIndex(item => item.id === id);
                                itemsArr[index] = updatedItem;
                                this._staffItems.next(itemsArr);
                                return updatedItem;
                            }),
                            switchMap(updatedItem => this.staffItem$.pipe(
                                take(1),
                                filter(item => item && item.id === id),
                                tap(() => {
                                    this._staffItem.next(updatedItem);
                                    return updatedItem;
                                })
                            ))
                        ))
                    );
                }
            case 'Customer':
                if(item.roleName === 'Staff') {
                    return this.customerItems$.pipe(
                        take(1),
                        switchMap(itemsArr => this._httpClient.patch<Account>(ENDPOINTS.account, {
                            ...item
                        }).pipe(
                            map((updatedItem) => {
                                const index = itemsArr.findIndex(item => item.id === id);
                                itemsArr.splice(index, 1);
                                this._customerItems.next(itemsArr);
                                this._staffItems.next([updatedItem, ...this._staffItems.value])
                                return updatedItem;
                            }),
                            switchMap(updatedItem => this.staffItem$.pipe(
                                take(1),
                                filter(item => item && item.id === id),
                                tap(() => {
                                    this._staffItem.next(updatedItem);
                                    return updatedItem;
                                })
                            ))
                        ))
                    );
                } else if(item.roleName === 'Partner') {
                    return this.customerItems$.pipe(
                        take(1),
                        switchMap(itemsArr => this._httpClient.patch<Account>(ENDPOINTS.account, {
                            ...item
                        }).pipe(
                            map((updatedItem) => {
                                const index = itemsArr.findIndex(item => item.id === id);
                                itemsArr.splice(index, 1);
                                this._customerItems.next(itemsArr);
                                this._partnerItems.next([updatedItem, ...this._partnerItems.value])
                                return updatedItem;
                            }),
                            switchMap(updatedItem => this.partnerItem$.pipe(
                                take(1),
                                filter(item => item && item.id === id),
                                tap(() => {
                                    this._partnerItem.next(updatedItem);
                                    return updatedItem;
                                })
                            ))
                        ))
                    );
                } else {
                    return this.customerItems$.pipe(
                        take(1),
                        switchMap(itemsArr => this._httpClient.patch<Account>(ENDPOINTS.account, {
                            ...item
                        }).pipe(
                            map((updatedItem) => {
                                const index = itemsArr.findIndex(item => item.id === id);
                                itemsArr[index] = updatedItem;
                                this._customerItems.next(itemsArr);
                                return updatedItem;
                            }),
                            switchMap(updatedItem => this.customerItem$.pipe(
                                take(1),
                                filter(item => item && item.id === id),
                                tap(() => {
                                    this._customerItem.next(updatedItem);
                                    return updatedItem;
                                })
                            ))
                        ))
                    );
                }
        }
    }

    delete(id: string, currentRole: string): Observable<boolean> {
        switch (currentRole) {
            case 'Owner':
                return this.ownerItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.delete(ENDPOINTS.account + `/${id}`, {params: {id}}).pipe(
                        map((isDeleted: boolean) => {
                            const index = items.findIndex(item => item.id === id);
                            items.splice(index, 1);
                            this._ownerItems.next(items);
                            return isDeleted;
                        })
                    ))
                );
            case 'Partner':
                return this.partnerItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.delete(ENDPOINTS.account + `/${id}`, {params: {id}}).pipe(
                        map((isDeleted: boolean) => {
                            const index = items.findIndex(item => item.id === id);
                            items.splice(index, 1);
                            this._partnerItems.next(items);
                            return isDeleted;
                        })
                    ))
                );
            case 'Staff':
                return this.staffItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.delete(ENDPOINTS.account + `/${id}`, {params: {id}}).pipe(
                        map((isDeleted: boolean) => {
                            const index = items.findIndex(item => item.id === id);
                            items.splice(index, 1);
                            this._staffItems.next(items);
                            return isDeleted;
                        })
                    ))
                );
            case 'Customer':
                return this.customerItems$.pipe(
                    take(1),
                    switchMap(items => this._httpClient.delete(ENDPOINTS.account + `/${id}`, {params: {id}}).pipe(
                        map((isDeleted: boolean) => {
                            const index = items.findIndex(item => item.id === id);
                            items.splice(index, 1);
                            this._customerItems.next(items);
                            return isDeleted;
                        })
                    ))
                );
        }
    }

    uploadImage(data : File): Observable<string>
    {
        let formData = new FormData();
        formData.append('files', data);
        return this._httpClient.post<FileInfo[]>(ENDPOINTS.file, formData).pipe(
            map((res) => {
                return res[0].link;
            })
        );
    }

    /**
     * Update the avatar of the given contact
     *
     * @param id
     * @param avatar
     */
    /*uploadAvatar(id: string, avatar: File): Observable<Contact>
    {
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.post<Contact>('api/apps/contacts/avatar', {
                id,
                avatar
            }, {
                headers: {
                    'Content-Type': avatar.type
                }
            }).pipe(
                map((updatedContact) => {

                    // Find the index of the updated contact
                    const index = contacts.findIndex(item => item.id === id);

                    // Update the contact
                    contacts[index] = updatedContact;

                    // Update the contacts
                    this._contacts.next(contacts);

                    // Return the updated contact
                    return updatedContact;
                }),
                switchMap(updatedContact => this.contact$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the contact if it's selected
                        this._contact.next(updatedContact);

                        // Return the updated contact
                        return updatedContact;
                    })
                ))
            ))
        );
    }*/
}
