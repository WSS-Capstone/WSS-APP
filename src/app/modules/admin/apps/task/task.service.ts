import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError} from 'rxjs';
import {Comment, Task, TaskPagination, TaskResponse} from './task.types';
import {ENDPOINTS} from "../../../../core/global.constants";
import {Category, CategoryResponse, FileInfo} from "../category/category.types";

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    // Private
    private _ownerItem: BehaviorSubject<Task | null> = new BehaviorSubject(null);
    private _partnerItem: BehaviorSubject<Task | null> = new BehaviorSubject(null);
    private _ownerItems: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _partnerItems: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _itemsCate: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _ownerPagination: BehaviorSubject<TaskPagination | null> = new BehaviorSubject(null);
    private _partnerPagination: BehaviorSubject<TaskPagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get ownerPagination$(): Observable<TaskPagination> {
        return this._ownerPagination.asObservable();
    }
    get partnerPagination$(): Observable<TaskPagination> {
        return this._partnerPagination.asObservable();
    }

    get ownerItem$(): Observable<Task> {
        return this._ownerItem.asObservable();
    }

    get partnerItem$(): Observable<Task> {
        return this._partnerItem.asObservable();
    }

    get ownerItems$(): Observable<Task[]> {
        return this._ownerItems.asObservable();
    }

    get partnerItems$(): Observable<Task[]> {
        return this._partnerItems.asObservable();
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


    getOwnerItems(page: number = 0, size: number = 10, sort: string = 'taskName', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<TaskResponse> {
        return this._httpClient.get<TaskResponse>(ENDPOINTS.task + '?ofPartner=false', {
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

    getPartnerItems(page: number = 0, size: number = 10, sort: string = 'taskName', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<TaskResponse> {
        return this._httpClient.get<TaskResponse>(ENDPOINTS.task + '?ofPartner=true', {
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

    /**
     * Get product by id
     */
    getOwnerItem(id: string): Observable<Task> {
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

    getPartnerItem(id: string): Observable<Task> {
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

    create(item: any, type: string): Observable<Task> {
        if(type === 'owner') {
            return this.ownerItems$.pipe(
                take(1),
                switchMap(items => this._httpClient.post<Task>(ENDPOINTS.task, item).pipe(
                    map((newItem) => {
                        if(items) {
                            this._ownerItems.next([newItem, ...items]);
                        }else {
                            this._ownerItems.next([newItem]);
                        }
                        return newItem;
                    })
                ))
            );
        } else if(type === 'partner') {
            return this.partnerItems$.pipe(
                take(1),
                switchMap(items => this._httpClient.post<Task>(ENDPOINTS.task, item).pipe(
                    map((newItem) => {
                        if(items) {
                            this._partnerItems.next([newItem, ...items]);
                        }else {
                            this._partnerItems.next([newItem]);
                        }
                        return newItem;
                    })
                ))
            );
        }
    }

    updateTask(id: string, item: any): Observable<Task> {
        return this.ownerItems$.pipe(
            take(1),
            switchMap(itemsArr => this._httpClient.put<Task>(ENDPOINTS.task + `/${id}`, {
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

    updateTaskPartner(id: string, item: any): Observable<Task> {
        return this.partnerItems$.pipe(
            take(1),
            switchMap(itemsArr => this._httpClient.put<Task>(ENDPOINTS.task + `/${id}`, {
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

    update(id: string, item: Task, type: string): Observable<Task> {
        if(type === 'owner') {
            return this.ownerItems$.pipe(
                take(1),
                switchMap(itemsArr => this._httpClient.put<Task>(ENDPOINTS.task + `/${id}`, {
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
        } else if(type === 'partner') {
            return this.partnerItems$.pipe(
                take(1),
                switchMap(itemsArr => this._httpClient.put<Task>(ENDPOINTS.task + `/${id}`, {
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
    }

    updateStatus(id: string, item: any, type: string): Observable<Task> {
        if(type === 'owner') {
            return this.ownerItems$.pipe(
                take(1),
                switchMap(itemsArr => this._httpClient.put<Task>(ENDPOINTS.task + `/${id}/status`, {
                    ...item
                }).pipe(
                    map((updatedItem) => {
                        const index = itemsArr.findIndex(item => item.id === id);
                        itemsArr[index].status = item.status;
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
        } else if(type === 'partner') {
            return this.partnerItems$.pipe(
                take(1),
                switchMap(itemsArr => this._httpClient.put<Task>(ENDPOINTS.task + `/${id}/status`, {
                    ...item
                }).pipe(
                    map((updatedItem) => {
                        const index = itemsArr.findIndex(item => item.id === id);
                        itemsArr[index].status = item.status;
                        this._partnerItems.next(itemsArr);
                        return itemsArr[index];
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
    }

    delete(id: string, type: string): Observable<boolean> {
        if(type === 'owner') {
            return this.ownerItems$.pipe(
                take(1),
                switchMap(items => this._httpClient.delete(ENDPOINTS.task + `/${id}`, {params: {id}}).pipe(
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
                switchMap(items => this._httpClient.delete(ENDPOINTS.task + `/${id}`, {params: {id}}).pipe(
                    map((isDeleted: boolean) => {
                        const index = items.findIndex(item => item.id === id);
                        items.splice(index, 1);
                        this._partnerItems.next(items);
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

    addComment(id: string, content: string, type: string) {
        if(type === 'owner') {
            return this.ownerItems$.pipe(
                take(1),
                switchMap(items => this._httpClient.post<Comment>(ENDPOINTS.comment, {taskId: id, content: content}).pipe(
                    map((comment: Comment) => {
                        const index = items.findIndex(item => item.id === id);
                        items[index].comments.push(comment)
                        this._ownerItems.next(items);
                        this._ownerItem.next(items[index]);
                        // return isCommented;
                    })
                ))
            );
        } else if(type === 'partner') {
            return this.partnerItems$.pipe(
                take(1),
                switchMap(items => this._httpClient.post<Comment>(ENDPOINTS.comment, {taskId: id, content: content}).pipe(
                    map((comment: Comment) => {
                        const index = items.findIndex(item => item.id === id);
                        items[index].comments.push(comment)
                        this._partnerItems.next(items);
                        this._partnerItem.next(items[index]);
                        // return isCommented;
                    })
                ))
            );
        }
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
