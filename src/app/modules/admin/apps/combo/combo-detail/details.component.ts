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
import {Combo} from "../combo.types";
import {ComboService} from "../combo.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {Category} from "../../category/category.types";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../../../environments/environment";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'category-details',
    templateUrl: './details.component.html',
    styles: [
        /* language=SCSS */
        `
            .combo-detail-grid {
                grid-template-columns: 120px 150px auto 150px 150px 80px;

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
export class ComboDetailComponent implements OnInit, OnDestroy {
    flashMessage: 'success' | 'error' | null = null;
    labels$: Observable<Label[]>;
    itemChanged: Subject<Combo> = new Subject<Combo>();
    item$: Observable<Combo>;
    categories$: Observable<Category[]>;
    tempImageUrl: string = null;
    isLoading: boolean = false;
    imgDataOrLink: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    readonly MAX_RATING = 5;

    form: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fb: FormBuilder,
        private _service: ComboService,
        private acitvatedRoute: ActivatedRoute,
        private sanitizer: DomSanitizer,
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
        this.acitvatedRoute.paramMap.subscribe(param => {
            this.isLoading = true;
            const id = param.get('id');
            this._service.getItem(id).subscribe(p => {
                this.item$ = this._service.item$;
                this.isLoading = false;
                this.item$.subscribe(value => this._patchValue(value));
                this.categories$ = this._service.categories$;
            });
        })
    }

    private _initForm(): void {
        this.form = this._fb.group({
            id: [null],
            name: [null, [Validators.required]],
            description: [null],
            discountValueCombo: [null],
            discountPrice: [null],
            imageUrl: [null],
            rating: [null],
            totalAmount: [null, [Validators.required]],
            status: [null],
        });
    }

    private _patchValue(value: Combo) {
        this.form.patchValue({
            id: value.id,
            name: value.name,
            description: value.description,
            discountValueCombo: value.discountValueCombo,
            discountPrice: value.disountPrice,
            imageUrl: value.imageUrl,
            rating: value.rating,
            totalAmount: value.totalAmount,
            status: value.status,
        });
        this.tempImageUrl = value.imageUrl;
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

    clearImage() {

    }
    create(): void {
        // this._service.create(this.form.value).pipe(
        //     map(() => {
        //         // Get the note
        //         // this.cate$ = this._categoryService.category$;
        //         this.showFlashMessage('success');
        //     })).subscribe();
        //
        // setTimeout(() => {
        //     this._matDialogRef.close();
        // }, 3100);
    }

    update(): void {
        // this._service.update(this.form.get('id').value ,this.form.value).pipe(
        //     map(() => {
        //         // Get the note
        //         // this.cate$ = this._categoryService.category$;
        //         this.showFlashMessage('success');
        //     })).subscribe();
        //
        // setTimeout(() => {
        //     this._matDialogRef.close();
        // }, 1200);
    }

    /**
     * Upload image to given note
     *
     * @param cate
     * @param fileList
     */
    uploadImage(event: any): void {
        if (!event.target.files[0]) {
            return;
        }

        const file = event.target.files[0];
        // send request upload file

        this._service.uploadImage(file).subscribe((res) => {
            console.log('res', res);
            this.tempImageUrl = res;
            this.form.patchValue({imageUrls: this.tempImageUrl})
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
        var imageRelativeUrl = imageUrl.substring(imageUrl.indexOf('/upload/'));
        var apiUrl = environment.wssApi;
        return this.sanitizer.bypassSecurityTrustUrl(apiUrl + imageRelativeUrl);
    }

    /**
     * Remove the image on the given note
     *
     * @param note
     */
    removeImage(cate: Combo): void {
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

    protected readonly Math = Math;
}
