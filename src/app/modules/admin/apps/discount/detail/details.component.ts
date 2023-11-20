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
import {Discount} from "../discount.types";
import {DiscountService} from "../discount.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {Category} from "../../category/category.types";
import { environment } from 'environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'discount-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class DiscountDetailsComponent implements OnInit, OnDestroy {
    flashMessage: 'success' | 'error' | null = null;
    labels$: Observable<Label[]>;
    itemChanged: Subject<Discount> = new Subject<Discount>();
    item$: Observable<Discount>;
    categories$: Observable<Category[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    imgDataOrLink: any;
    form: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fb: FormBuilder,
        private sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) private _data: { service: Discount },
        private _service: DiscountService,
        private _matDialogRef: MatDialogRef<DiscountDetailsComponent>
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
        // Edit
        if (this._data.service.id) {
            console.log("Edit");
            // Request the data from the server
            this._service.getItem(this._data.service.id).subscribe();

            // Get the note
            this.item$ = this._service.item$;

            this.item$.subscribe((value) => {
                this.imgDataOrLink = this.mapImageUrl(value.imageUrl);
                this._changeDetectorRef.detectChanges();
                this._patchValue(value);
            });
        }
        // Add
        else {
            console.log("Add");
            // Create an empty note
            const item: Discount = {
                id: null,
                name: "",
                code: "",
                endTime: null,
                startTime: null,
                imageUrl: null,
                discountValueVoucher: null,
            };

            this.item$ = of(item);
        }
    }

    private _initForm(): void {
        this.form = this._fb.group({
            id: [null],
            code: [null],
            name: [null, [Validators.required, Validators.maxLength(80)]],
            startTime: [null, [Validators.required]],
            endTime: [null, [Validators.required]],
            minAmount: [null, [Validators.required, Validators.min(1000), Validators.pattern('^-?[0-9]*$')]],
            discountValueVoucher: [null, [Validators.required, Validators.min(1000), Validators.pattern('^-?[0-9]*$')]],
            imageUrl: [null],
        });
    }

    private _patchValue(value: Discount) {
        this.form.patchValue({
            id: value.id,
            code: value.code,
            name: value.name,
            startTime: new Date(value.startTime),
            endTime: new Date(value.endTime),
            minAmount: value.minAmount,
            discountValueVoucher: value.discountValueVoucher,
            imageUrl: value.imageUrl
        });
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

    filterStart = (date: Date | null): boolean => {
        const endDate = this.form.get('endTime').value;

        return (
          !endDate || date <= endDate
        );
    }

    filterEnd = (date: Date | null): boolean => {
        const startDate = this.form.get('startTime').value;

        return (
            !startDate || date >= startDate
        );
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

    /**
     * Upload image to given note
     *
     * @param cate
     * @param fileList
     */
    uploadImage(event: any): void {
        // Return if canceled
        if (!event.target.files[0]) {
            return;
        }

        const file = event.target.files[0];
        // send request upload file

        this._service.uploadImage(file).subscribe((res) => {
            console.log('res', res);
            this.form.patchValue({
                imageUrl: res,
            });
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.imgDataOrLink = this.mapImageUrl(res);
                this._changeDetectorRef.markForCheck();
            };
            // this.imgDataOrLink = this.mapImageUrl(res);
        });
    }

    mapImageUrl(imageUrl: string): any {
        var imageRelativeUrl = imageUrl?.substring(imageUrl.indexOf('/upload/'));
        var apiUrl = environment.wssApi;
        return this.sanitizer.bypassSecurityTrustUrl(apiUrl + imageRelativeUrl);
    }

    /**
     * Remove the image on the given note
     *
     * @param note
     */
    removeImage(cate: Discount): void {
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
