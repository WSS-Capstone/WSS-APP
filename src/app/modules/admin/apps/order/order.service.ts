import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError} from 'rxjs';
import {Order, OrderPagination, OrderResponse, WeddingInformation, WeddingInformationResponse} from './order.types';
import {ENDPOINTS} from "../../../../core/global.constants";
import {Category, CategoryResponse} from "../category/category.types";
import {Discount, DiscountResponse} from "../discount/discount.types";
import {Account, AccountResponse} from "../user/user.types";

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    // Private
    private _item: BehaviorSubject<Order | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<Order[] | null> = new BehaviorSubject(null);
    private _itemWedding: BehaviorSubject<WeddingInformation | null> = new BehaviorSubject(null);
    private _itemsWedding: BehaviorSubject<WeddingInformation[] | null> = new BehaviorSubject(null);
    private _itemsVoucher: BehaviorSubject<Discount[] | null> = new BehaviorSubject(null);
    private _itemsUser: BehaviorSubject<Account[] | null> = new BehaviorSubject(null);
    private _itemVoucher: BehaviorSubject<Discount | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<OrderPagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get pagination$(): Observable<OrderPagination> {
        return this._pagination.asObservable();
    }

    get item$(): Observable<Order> {
        return this._item.asObservable();
    }

    get items$(): Observable<Order[]> {
        return this._items.asObservable();
    }

    get weddings$(): Observable<WeddingInformation[]> {
        return this._itemsWedding.asObservable();
    }

    get wedding$(): Observable<WeddingInformation> {
        return this._itemWedding.asObservable();
    }

    get users$(): Observable<Account[]> {
        return this._itemsUser.asObservable();
    }

    get vouchers$(): Observable<Discount[]> {
        return this._itemsVoucher.asObservable();
    }

    get voucher$(): Observable<Discount> {
        return this._itemVoucher.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getUsers(): Observable<Account[]> {
        return this._httpClient.get<AccountResponse>(ENDPOINTS.account+ "?roleNames=Staff&roleNames=Partner", {
            params: {
                'page-size': '' + 250,
            }
        }).pipe(
            tap((categories) => {
                console.log(categories);
                this._itemsUser.next(categories.data);
            }),
            map((categories) => {
                return categories.data;
            })
        );
    }

    /**
     * Get categories
     */
    getAllWeddingInformations(): Observable<WeddingInformation[]> {
        return this._httpClient.get<WeddingInformationResponse>(ENDPOINTS.wedding, {
            params: {
                'page-size': '' + 250,
            }
        }).pipe(
            tap((categories) => {
                console.log(categories);
                this._itemsWedding.next(categories.data);
            }),
            map((categories) => {
                return categories.data;
            })
        );
    }

    getAllDiscounts(): Observable<Discount[]> {
        return this._httpClient.get<DiscountResponse>(ENDPOINTS.voucher, {
            params: {
                'page-size': '' + 250,
            }
        }).pipe(
            tap((categories) => {
                console.log(categories);
                this._itemsVoucher.next(categories.data);
            }),
            map((categories) => {
                return categories.data;
            })
        );
    }

    getOrderById(id: string): Observable<Order> {
        return this._httpClient.get<Order>(ENDPOINTS.order + `/${id}`).pipe(
            tap((response) => {
                console.log(response);
                this._item.next(response);
                return response;
            })
        )
    }

    getItems(page: number = 0, size: number = 10, sort: string = 'Name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<OrderResponse> {
        return this._httpClient.get<OrderResponse>(ENDPOINTS.order, {
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
    getItem(id: string): Observable<Order> {
        if(this._items.getValue() === null) {
            return this.getOrderById(id)
        }

        return this._items.pipe(
            take(1),
            map((products) => {
                if(products && products.length > 0) {
                    const product = products.find(item => item.id === id) || null;

                    // Update the product
                    this._item.next(product);
                    // Return the product
                    return product;
                }
            }),
            switchMap((product) => {

                if (!product) {
                    return throwError('Could not found product with id of ' + id + '!');
                }

                return of(product);
            })
        );
    }

    getWedding(id: string): Observable<WeddingInformation> {
        return this._itemsWedding.pipe(
            take(1),
            map((products) => {

                // Find the product
                const product = products.find(item => item.id === id) || null;

                // Update the product
                this._itemWedding.next(product);

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

    create(item: Order): Observable<Order> {
        return this.items$.pipe(
            take(1),
            switchMap(items => this._httpClient.post<Order>(ENDPOINTS.order, item).pipe(
                map((newItem) => {


                    this._items.next([newItem, ...items]);

                    return newItem;
                })
            ))
        );
    }

    update(id: string, item: Order): Observable<Order> {
        return this.items$.pipe(
            take(1),
            switchMap(itemsArr => this._httpClient.put<Order>(ENDPOINTS.order + `/approval`, {
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

    approval(id: string, status: string): Observable<Order> {
        return this.items$.pipe(
            take(1),
            switchMap(itemsArr => this._httpClient.put<Order>(ENDPOINTS.order + `/approval?id=${id}&request=${status}`, {}).pipe(
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
