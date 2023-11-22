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
import {Payment} from "../payment.types";
import {PaymentService} from "../payment.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {Category} from "../../category/category.types";
import {formatDate} from "@angular/common";
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'payment-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class PaymentDetailsComponent implements OnInit, OnDestroy {
    flashMessage: 'success' | 'error' | null = null;
    labels$: Observable<Label[]>;
    itemChanged: Subject<Payment> = new Subject<Payment>();
    item$: Observable<Payment>;
    categories$: Observable<Category[]>;
    readonly MAX_RATING = 5;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    form: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fb: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        @Inject(MAT_DIALOG_DATA) private _data: { service: Payment },
        private _service: PaymentService,
        private _matDialogRef: MatDialogRef<PaymentDetailsComponent>
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
        // this.categories$ = this._service.categories$;
        // Edit
        if (this._data.service.id) {
            console.log("Edit");
            // Request the data from the server
            this._service.getItem(this._data.service.id).subscribe(f => console.log(f));

            // Get the note
            this.item$ = this._service.item$;

            this.item$.subscribe((value) => {
                this._patchValue(value);
            });
        }
    }

    private _initForm(): void {
        this.form = this._fb.group({
            id: [null],
            createDate: [null],
            content: [null],
            rating: [null],
            fullname: [null],
            serviceName: [null],
            status: [null],
        });
    }

    private _patchValue(value: Payment) {
        // this.form.patchValue({
        //     id: value.id,
        //     fullname: value.user?.fullname,
        //     serviceName: value.service?.name,
        //     createDate: formatDate(value.createDate, 'dd/MM/yyyy hh:mm', 'en'),
        //     content: value.content,
        //     rating: value.rating,
        //     status: value.status,
        // });
    }

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

    numSequence(n: number): Array<number> {
        return Array(n);
    }

    create(): void {
        this._service.create(this.form.value).pipe(
            map(() => {
                // Get the note
                // this.cate$ = this._categoryService.category$;
                this.showFlashMessage('success');
            })).subscribe();

        setTimeout(() => {
            this._matDialogRef.close();
        }, 3100);
    }

    update(): void {
        this._service.update(this.form.get('id').value ,this.form.value).pipe(
            map(() => {
                // Get the note
                // this.cate$ = this._categoryService.category$;
                this.showFlashMessage('success');
            })).subscribe();

        setTimeout(() => {
            this._matDialogRef.close();
        }, 1200);
    }

    show(id: string): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Hiển thị đánh giá',
            message: 'Bạn có chắc chắn muốn hiển thị đánh giá này?!',
            icon:{
                show: true,
                color: "primary"
            },
            actions: {
                confirm: {
                    label: 'Hiện',
                    color: 'primary'
                },
                cancel: {
                    label: 'Hủy'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                console.log(result);
                console.log(result);
                const ccc = this._service.patch(id, 'Approved').subscribe(() => {
                    this.showFlashMessage('success');
                    ccc.unsubscribe();
                    // Close the details
                    // this.closeDetails();
                });
            }
        });
    }

    hide(id: string): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Ẩn đánh giá',
            message: 'Bạn có chắc chắn muốn ẩn đánh giá này?!',
            icon:{
                show: true,
                color: "primary"
            },
            actions: {
                confirm: {
                    label: 'Ẩn',
                },
                cancel: {
                    label: 'Hủy'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                console.log(result);
                const ccc = this._service.patch(id, 'Rejected').subscribe(() => {
                    this.showFlashMessage('success');
                    ccc.unsubscribe();
                    // Close the details
                    // this.closeDetails();
                });
            }
        });
    }

    /**
     * Upload image to given note
     *
     * @param cate
     * @param fileList
     */
    uploadImage(cate: Payment, fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            return;
        }

        this._readAsDataURL(file).then((data) => {

            // Update the image
            cate.imageUrl = data;

            // Update the note
            this.itemChanged.next(cate);
        });
    }

    /**
     * Remove the image on the given note
     *
     * @param note
     */
    removeImage(cate: Payment): void {
        cate.imageUrl = null;

        // Update the cate
        this.itemChanged.next(cate);
    }

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
