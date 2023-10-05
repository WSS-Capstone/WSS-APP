import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError} from 'rxjs';
import {
    InventoryBrand,
    InventoryCategory,
    InventoryPagination,
    InventoryTag,
    InventoryVendor
} from 'app/modules/admin/apps/ecommerce/inventory/inventory.types';
import {Category, CategoryPagination, CategoryResponse} from './category.types';
import {ENDPOINTS} from "../../../../core/global.constants";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    // Private
    private _brands: BehaviorSubject<InventoryBrand[] | null> = new BehaviorSubject(null);
    private _categories: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<CategoryPagination | null> = new BehaviorSubject(null);
    private _category: BehaviorSubject<Category | null> = new BehaviorSubject(null);
    private _categorys: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _tags: BehaviorSubject<InventoryTag[] | null> = new BehaviorSubject(null);
    private _vendors: BehaviorSubject<InventoryVendor[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------


    /**
     * Getter for categories
     */
    get parentCategories$(): Observable<Category[]> {
        return this._categories.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<InventoryPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for product
     */
    get category$(): Observable<Category> {
        return this._category.asObservable();
    }

    /**
     * Getter for products
     */
    get categories$(): Observable<Category[]> {
        return this._categorys.asObservable();
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
                this._categories.next(categories.data);
            }),
            map((categories) => {
                return categories.data;
            })
        );
    }

    /**
     * Get products
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getCategories(page: number = 0, size: number = 10, sort: string = 'Name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<CategoryResponse> {
        return this._httpClient.get<CategoryResponse>(ENDPOINTS.category, {
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
                this._categorys.next(response.data);
            })
        );
    }

    /**
     * Get product by id
     */
    getCategoryById(id: string): Observable<Category> {
        return this._categorys.pipe(
            take(1),
            map((products) => {

                // Find the product
                const product = products.find(item => item.id === id) || null;

                // Update the product
                this._category.next(product);

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

    /**
     * Create product
     */
    createCategory(): Observable<Category> {
        return this.categories$.pipe(
            take(1),
            switchMap(cates => this._httpClient.post<Category>(ENDPOINTS.category, {}).pipe(
                map((newCate) => {


                    this._categorys.next([newCate, ...cates]);

                    return newCate;
                })
            ))
        );
    }

    /**
     * Update product
     *
     * @param id
     * @param product
     */
    updateCategory(id: string, category: Category): Observable<Category> {
        return this.categories$.pipe(
            take(1),
            switchMap(categories => this._httpClient.put<Category>(ENDPOINTS.category + `/${id}`, {
                ...category
            }).pipe(
                map((updatedCategory) => {

                    // Find the index of the updated product
                    const index = categories.findIndex(item => item.id === id);

                    // Update the product
                    categories[index] = updatedCategory;

                    // Update the categories
                    this._categorys.next(categories);

                    // Return the updated product
                    return updatedCategory;
                }),
                switchMap(updatedCategory => this.category$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the product if it's selected
                        this._category.next(updatedCategory);

                        // Return the updated product
                        return updatedCategory;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the product
     *
     * @param id
     */
    deleteCategory(id: string): Observable<boolean> {
        return this.categories$.pipe(
            take(1),
            switchMap(products => this._httpClient.delete(ENDPOINTS.category + `/${id}`, {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    const index = products.findIndex(item => item.id === id);

                    products.splice(index, 1);

                    this._categorys.next(products);

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