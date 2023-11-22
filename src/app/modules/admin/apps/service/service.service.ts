import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError} from 'rxjs';
import {Service, ServicePagination, ServiceResponse} from './service.types';
import {ENDPOINTS} from "../../../../core/global.constants";
import {Category, CategoryResponse, FileInfo} from "../category/category.types";
import {ApproveService} from "../service-approval/service-approval.types";

@Injectable({
    providedIn: 'root'
})
export class ServiceService {
    // Private
    private _ownerItems: BehaviorSubject<Service[] | null> = new BehaviorSubject(null);
    private _partnerItems: BehaviorSubject<Service[] | null> = new BehaviorSubject(null);
    private _pendingItems: BehaviorSubject<Service[] | null> = new BehaviorSubject(null);
    private _ownerItem: BehaviorSubject<Service | null> = new BehaviorSubject(null);
    private _partnerItem: BehaviorSubject<Service | null> = new BehaviorSubject(null);
    private _pendingItem: BehaviorSubject<Service | null> = new BehaviorSubject(null);
    private _itemsCate: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _ownerPagination: BehaviorSubject<ServicePagination | null> = new BehaviorSubject(null);
    private _partnerPagination: BehaviorSubject<ServicePagination | null> = new BehaviorSubject(null);
    private _pendingPagination: BehaviorSubject<ServicePagination | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for pagination
     */
    get ownerPagination$(): Observable<ServicePagination> {
        return this._ownerPagination.asObservable();
    }

    get partnerPagination$(): Observable<ServicePagination> {
        return this._partnerPagination.asObservable();
    }

    get pendingPagination$(): Observable<ServicePagination> {
        return this._pendingPagination.asObservable();
    }

    get ownerItem$(): Observable<Service> {
        return this._ownerItem.asObservable();
    }

    get partnerItem(): Observable<Service> {
        return this._partnerItem.asObservable();
    }

    get pendingItem$(): Observable<Service> {
        return this._pendingItem.asObservable();
    }

    get ownerItems$(): Observable<Service[]> {
        return this._ownerItems.asObservable();
    }

    get partnerItems$(): Observable<Service[]> {
        return this._partnerItems.asObservable();
    }

    get pendingItems$(): Observable<Service[]> {
        return this._pendingItems.asObservable();
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
        Observable<ServiceResponse> {
        return this._httpClient.get<ServiceResponse>(ENDPOINTS.service + '?ownerService=true', {
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
        Observable<ServiceResponse> {
        return this._httpClient.get<ServiceResponse>(ENDPOINTS.service + '?ownerService=false&status=Active&status=InActive&status=Deleted', {
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

    getPendingItems(page: number = 0, size: number = 10, sort: string = 'status', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<ServiceResponse> {
        return this._httpClient.get<ServiceResponse>(ENDPOINTS.service + '?ownerService=false&status=Pending&status=Reject', {
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
                this._pendingPagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._pendingItems.next(response.data);
            })
        );
    }

    /**
     * Get product by id
     */
    getOwnerItem(id: string): Observable<Service> {
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

    getPartnerItem(id: string): Observable<Service> {
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

    getPendingItem(id: string): Observable<Service> {
        return this._pendingItems.pipe(
            take(1),
            map((products) => {

                // Find the product
                const product = products.find(item => item.id === id) || null;

                // Update the product
                this._pendingItem.next(product);

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

    changeStatusPartner(id: string, status: string): Observable<Service> {
        return this._partnerItems.pipe(
            take(1),
            switchMap(services => this._httpClient.patch<Service>(ENDPOINTS.service + `/${id}/status?status=${status}`, {}).pipe(
                map((updatedService) => {

                    // Find the index of the updated product
                    const index = services.findIndex(item => item.id === id);

                    // Update the product
                    services[index].status = status;

                    // Update the services
                    this._partnerItems.next(services);

                    // Return the updated product
                    return updatedService;
                }),
                switchMap(updatedCategory => this._partnerItem.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {
                        this._partnerItem.next(updatedCategory);
                        return updatedCategory;
                    })
                ))
            ))
        );
    }

    changeStatusOwner(id: string, status: string): Observable<Service> {
        return this._ownerItems.pipe(
            take(1),
            switchMap(services => this._httpClient.patch<Service>(ENDPOINTS.service + `/${id}/status?status=${status}`, {}).pipe(
                map((updatedService) => {

                    // Find the index of the updated product
                    const index = services.findIndex(item => item.id === id);

                    // Update the product
                    services[index].status = status;

                    // Update the services
                    this._ownerItems.next(services);

                    // Return the updated product
                    return updatedService;
                }),
                switchMap(updatedCategory => this._ownerItem.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {
                        this._ownerItem.next(updatedCategory);
                        return updatedCategory;
                    })
                ))
            ))
        );
    }


    create(item: Service): Observable<Service> {
        return this.ownerItems$.pipe(
            take(1),
            switchMap(items => this._httpClient.post<Service>(ENDPOINTS.service, item).pipe(
                map((newItem) => {


                    this._ownerItems.next([newItem, ...items]);

                    return newItem;
                })
            ))
        );
    }

    update(id: string, item: Service): Observable<Service> {
        return this.ownerItems$.pipe(
            take(1),
            switchMap(itemsArr => this._httpClient.put<Service>(ENDPOINTS.service + `/${id}`, {
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

    approval(id: string, item: any): Observable<ApproveService> {
        return this.pendingItems$.pipe(
            take(1),
            switchMap(itemsArr => this._httpClient.put<ApproveService>(ENDPOINTS.service + `/approval/${id}`, {
                ...item
            }).pipe(
                map((updatedItem) => {
                    const index = itemsArr.findIndex(item => item.id === id);
                    if(item.status === "Reject") {
                        itemsArr[index].status = "Reject";
                    }
                    else {
                        itemsArr.splice(index, 1);
                    }
                    this._pendingItems.next(itemsArr);

                    return updatedItem;
                }),
                switchMap(updatedItem => this.pendingItem$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {
                        if(item.status !== 'Reject') {
                            this._partnerItems.next([updatedItem, ...this._partnerItems.value]);
                        }

                        this._pendingItem.next(updatedItem);
                        return updatedItem;
                    })
                ))
            ))
        );
    }

    delete(id: string, type: string): Observable<boolean> {
        if(type === 'owner') {
            return this.ownerItems$.pipe(
                take(1),
                switchMap(items => this._httpClient.delete(ENDPOINTS.service + `/${id}`).pipe(
                    map((isDeleted: boolean) => {
                        const index = items.findIndex(item => item.id === id);
                        items.splice(index, 1);
                        this._ownerItems.next(items);
                        return isDeleted;
                    })
                ))
            );
        } else if(type === 'partner') {
            return this.partnerItems$.pipe(
                take(1),
                switchMap(items => this._httpClient.delete(ENDPOINTS.service + `/${id}`).pipe(
                    map((isDeleted: boolean) => {
                        const index = items.findIndex(item => item.id === id);
                        items.splice(index, 1);
                        this._partnerItems.next(items);
                        return isDeleted;
                    })
                ))
            );
        } else if(type === 'pending') {
            return this.pendingItems$.pipe(
                take(1),
                switchMap(items => this._httpClient.delete(ENDPOINTS.service + `/${id}`).pipe(
                    map((isDeleted: boolean) => {
                        const index = items.findIndex(item => item.id === id);
                        items.splice(index, 1);
                        this._pendingItems.next(items);
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
