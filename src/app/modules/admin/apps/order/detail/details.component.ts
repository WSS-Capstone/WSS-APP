import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {map, Observable, of, Subject} from 'rxjs';
import {Label} from 'app/modules/admin/apps/notes/notes.types';
import {Order} from "../order.types";
import {OrderService} from "../order.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {Category} from "../../category/category.types";
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'order-details',
    templateUrl: './details.component.html',
    styles: [
        /* language=SCSS */
        `
            .order-detail-grid {
                grid-template-columns: 32px 150px 150px 150px 150px 150px auto 80px;

                /* @screen sm {
                    grid-template-columns: 57px auto 80px;
                }

                @screen md {
                    grid-template-columns: 56px 126px auto 80px;
                } */

                /* @screen lg {
                    grid-template-columns: 56px 200px 200px 200px 200px 200px auto 200px;
                } */
            }
        `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
    flashMessage: 'success' | 'error' | null = null;
    labels$: Observable<Label[]>;
    itemChanged: Subject<Order> = new Subject<Order>();
    item$: Observable<Order>;
    categories$: Observable<Category[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    form: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fb: FormBuilder,
        // @Inject(MAT_DIALOG_DATA) private _data: { service: Order },
        private _service: OrderService,
        // private _matDialogRef: MatDialogRef<OrderDetailsComponent>,
        private acitvatedRoute: ActivatedRoute,
    ) {
        this._initForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.categories$ = this._service.categories$;
        this.acitvatedRoute.paramMap.subscribe(param => {
            this.isLoading = true;
            const id = param.get('id');
            this._service.getItem(id).subscribe(p => {
                console.log(p)
                this.isLoading = false;
            });

            // Get the note
            this.item$ = this._service.item$;

            // this.item$.subscribe((value) => {
            //     this._patchValue(value);
            // });
          })
        // Edit
        // if (this._data.service.id) {
        //     console.log("Edit");
        //     // Request the data from the server
        //     this._service.getItem(this._data.service.id).subscribe();

        //     // Get the note
        //     this.item$ = this._service.item$;

        //     this.item$.subscribe((value) => {
        //         this._patchValue(value);
        //     });
        // }
        // Add
        // else {
        //     console.log("Add");
        //     // Create an empty note
        //     const item: Order = {
        //         vouncherId: "",
        //         id: null,
        //         fullname: '',
        //         description: '',
        //         customerId: null,
        //         ownerId: null,
        //         status: 1
        //     };

        //     this.item$ = of(item);
        // }
    }

    private _initForm(): void {
        this.form = this._fb.group({
            id: [null],
            name: [null, [Validators.required, Validators.maxLength(80)]],
            categoryId: [null],
            description: [null],
            ownerId: [null],
            quantity: [null],
            coverUrl: [null],
            status: [null],
        });
    }

    // private _patchValue(value: Order) {
    //     this.form.patchValue({
    //         id: value.id,
    //         fullname: value.fullname,
    //         // categoryId: value.categoryId,
    //         description: value.description,
    //         // ownerId: value.ownerId,
    //         // quantity: value.quantity,
    //         // coverUrl: value.coverUrl,
    //         status: value.status,
    //     });
    // }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    // create(): void {
    //     this._service.create(this.form.value).pipe(
    //         map(() => {
    //             // Get the note
    //             // this.cate$ = this._categoryService.category$;
    //             this.showFlashMessage('success');
    //         })).subscribe();

    //     setTimeout(() => {
    //         // this._matDialogRef.close();
    //     }, 3100);
    // }

    // update(): void {
    //     this._service.update(this.form.get('id').value ,this.form.value).pipe(
    //         map(() => {
    //             // Get the note
    //             // this.cate$ = this._categoryService.category$;
    //             this.showFlashMessage('success');
    //         })).subscribe();

    //     setTimeout(() => {
    //         // this._matDialogRef.close();
    //     }, 1200);
    // }

    /**
     * Upload image to given note
     *
     * @param cate
     * @param fileList
     */
    // uploadImage(cate: Order, fileList: FileList): void {
    //     // Return if canceled
    //     if (!fileList.length) {
    //         return;
    //     }

    //     const allowedTypes = ['image/jpeg', 'image/png'];
    //     const file = fileList[0];

    //     // Return if the file is not allowed
    //     if (!allowedTypes.includes(file.type)) {
    //         return;
    //     }

    //     this._readAsDataURL(file).then((data) => {

    //         // Update the image
    //         cate.description = data;

    //         // Update the note
    //         this.itemChanged.next(cate);
    //     });
    // }

    /**
     * Remove the image on the given note
     *
     * @param note
     */
    // removeImage(cate: Order): void {
    //     cate.description = null;

    //     // Update the cate
    //     this.itemChanged.next(cate);
    // }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Read the given file for demonstration purposes
     *
     * @param file
     */
    private _readAsDataURL(file: File): Promise<any> {
        // Return a new promise
        return new Promise((resolve, reject) => {

            // Create a new reader
            const reader = new FileReader();

            // Resolve the promise on success
            reader.onload = (): void => {
                resolve(reader.result);
            };

            // Reject the promise on error
            reader.onerror = (e): void => {
                reject(e);
            };

            // Read the file as the
            reader.readAsDataURL(file);
        });
    }

    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 1000);
    }
}