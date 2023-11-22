import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError} from 'rxjs';
import {Payment, PaymentPagination, PaymentResponse} from './payment.types';
import {ENDPOINTS} from "../../../../core/global.constants";
import {Category, CategoryResponse} from "../category/category.types";

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    // Private
    private _item: BehaviorSubject<Payment | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<Payment[] | null> = new BehaviorSubject(null);
    private _itemsCate: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<PaymentPagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get pagination$(): Observable<PaymentPagination> {
        return this._pagination.asObservable();
    }

    get item$(): Observable<Payment> {
        return this._item.asObservable();
    }

    get items$(): Observable<Payment[]> {
        return this._items.asObservable();
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


    getItems(page: number = 0, size: number = 10, sort: string = 'Status', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<PaymentResponse> {
        return this._httpClient.get<PaymentResponse>(ENDPOINTS.payment + '/partner', {
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
    getItem(id: string): Observable<Payment> {
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

    create(item: Payment): Observable<Payment> {
        return this.items$.pipe(
            take(1),
            switchMap(items => this._httpClient.post<Payment>(ENDPOINTS.combo, item).pipe(
                map((newItem) => {


                    this._items.next([newItem, ...items]);

                    return newItem;
                })
            ))
        );
    }

    update(id: string, item: Payment): Observable<Payment> {
        return this.items$.pipe(
            take(1),
            switchMap(itemsArr => this._httpClient.put<Payment>(ENDPOINTS.feedback + `/${id}`, {
                ...item
            }).pipe(
                map((updatedItem) => {
                    const index = itemsArr.findIndex(item => item.id === id);
                    itemsArr[index] = updatedItem;
                    this._items.next(itemsArr);
                    return updatedItem;
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

    patch(id: string, status: string): Observable<Payment> {
        return this.items$.pipe(
            take(1),
            switchMap(itemsArr => this._httpClient.patch<Payment>(ENDPOINTS.payment + `/partner/${id}/status?status=${status}`, {}).pipe(
                map((updatedItem) => {
                    const index = itemsArr.findIndex(item => item.id === id);
                    itemsArr[index].status = status;
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
