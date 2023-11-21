import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError} from 'rxjs';
import {Combo, ComboPagination, ComboResponse} from './combo.types';
import {ENDPOINTS} from "../../../../core/global.constants";
import {Category, CategoryResponse, FileInfo} from "../category/category.types";
import { Service, ServiceResponse } from '../service/service.types';
import {Order} from "../order/order.types";

@Injectable({
    providedIn: 'root'
})
export class ComboService {
    // Private
    private _item: BehaviorSubject<Combo | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<Combo[] | null> = new BehaviorSubject(null);
    private _itemsCate: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _itemsService: BehaviorSubject<Service[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<ComboPagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get pagination$(): Observable<ComboPagination> {
        return this._pagination.asObservable();
    }

    get item$(): Observable<Combo> {
        return this._item.asObservable();
    }

    get items$(): Observable<Combo[]> {
        return this._items.asObservable();
    }

    get categories$(): Observable<Category[]> {
        return this._itemsCate.asObservable();
    }

    get services$(): Observable<Service[]> {
        return this._itemsService.asObservable();
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

    getAllServices(): Observable<Service[]> {
        return this._httpClient.get<ServiceResponse>(ENDPOINTS.service, {
            params: {
                // 'status': 'Active',
                'page-size': '' + 250,
            }
        }).pipe(
            tap((services) => {
                console.log(services);
                this._itemsService.next(services.data);
            }),
            map((services) => {
                return services.data;
            })
        );
    }


    getItems(page: number = 0, size: number = 10, sort: string = 'Name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<ComboResponse> {
        return this._httpClient.get<ComboResponse>(ENDPOINTS.combo, {
            params: {
                page: '' + (page),
                'page-size': '' + size,
                'sort-key': 'CreateDate',
                'sort-order': 'DESC',
                name: search
            }
        }).pipe(
            tap((response) => {
                console.log(response);
                this._pagination.next({
                    length: response.total,
                    size: response.size,
                    page: response.page,
                    lastPage: response.total % response.size === 0 ? response.total / response.size : Math.floor(response.total / response.size) + 1,
                    startIndex: 1,
                    endIndex: 5
                });
                this._items.next(response.data);
            })
        );
    }

    /**
     * Get product by id
     */
    getItem(id: string): Observable<Combo> {
        return this._items.pipe(
            take(1),
            map((products) => {

                // Find the product
                const product = products.find(item => item.id === id) || null;

                // Update the product
                this._item.next(product);

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

    getItemById(id: string): Observable<Combo> {
        return this._httpClient.get<Combo>(ENDPOINTS.combo + `/${id}`).pipe(
            tap((response) => {
                console.log(response);
                this._item.next(response);
                return response;
            })
        )
    }

    create(item: any): Observable<Combo> {
        return this.items$.pipe(
            take(1),
            switchMap(items => this._httpClient.post<Combo>(ENDPOINTS.combo, item).pipe(
                map((newItem) => {
                    if(items) {
                        this._items.next([newItem, ...items]);
                    }
                    else {
                        this._items.next([newItem]);
                    }
                    return newItem;
                })
            ))
        );
    }

    update(id: string, item: any): Observable<Combo> {
        return this.items$.pipe(
            take(1),
            switchMap(itemsArr => this._httpClient.put<Combo>(ENDPOINTS.combo + `/${id}`, {
                ...item
            }).pipe(
                map((updatedItem) => {
                    const index = itemsArr.findIndex(item => item.id === id);
                    itemsArr[index] = updatedItem;
                    this._items.next(itemsArr);
                    return itemsArr[index];
                }),
                switchMap(updatedItem => this.item$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {
                        this._item.next(updatedItem);
                        return updatedItem;
                    })
                ))
            ))
        );
    }

    delete(id: string): Observable<boolean> {
        return this.items$.pipe(
            take(1),
            switchMap(items => this._httpClient.delete(ENDPOINTS.combo + `/${id}`, {params: {id}}).pipe(
                map((isDeleted: boolean) => {
                    const index = items.findIndex(item => item.id === id);
                    items.splice(index, 1);
                    this._items.next(items);
                    return isDeleted;
                })
            ))
        );
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
