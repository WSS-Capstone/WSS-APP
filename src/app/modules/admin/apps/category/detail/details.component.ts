import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, of, Subject } from 'rxjs';
import { Label } from 'app/modules/admin/apps/notes/notes.types';
import { Category } from '../category.types';
import { CategoryService } from '../category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import { FuseAlertService } from '../../../../../../@fuse/components/alert';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'category-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class CategoryDetailsComponent implements OnInit, OnDestroy {
    cate$: Observable<Category>;
    parentCategories$: Observable<Category[]>;
    labels$: Observable<Label[]>;
    flashMessage: 'success' | 'error' | null = null;
    cateChanged: Subject<Category> = new Subject<Category>();
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
        @Inject(MAT_DIALOG_DATA) private _data: { category: Category },
        private _categoryService: CategoryService,
        private _matDialogRef: MatDialogRef<CategoryDetailsComponent>,
    ) {
        this._initForm();
        this.cate$ = this.form.valueChanges.pipe(
            map((value) => {
                const cate = { ...value };
                this.imgDataOrLink = this.mapImageUrl(cate.imageUrl);
                return value;
            })
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    sanitizeImageUrl(imageUrl: string): any {
        return this.sanitizer.bypassSecurityTrustUrl('http://' + imageUrl);
    }
    /**
     * On init
     */
    ngOnInit(): void {
        this.parentCategories$ = this._categoryService.parentCategories$;
        // Edit
        if (this._data.category.id) {
            console.log('Edit');
            // Request the data from the server
            this._categoryService
                .getCategoryById(this._data.category.id)
                .subscribe();

            // Get the note
            this.cate$ = this._categoryService.category$;

            this.cate$.subscribe((value) => {
                this.imgDataOrLink = this.mapImageUrl(value.imageUrl);
                this._changeDetectorRef.detectChanges();
                this._patchValue(value);
            });
        }
        // Add
        else {
            console.log('Add');
            // Create an empty note
            const category: Category = {
                isOrderLimit: false,
                commission: undefined,
                id: null,
                name: '',
                description: '',
                imageUrl: null,
                categoryId: null,
                status: true
            };

            this.cate$ = of(category);
        }
    }

    private _initForm(): void {
        this.form = this._fb.group({
            id: [null],
            name: [null, [Validators.required, Validators.maxLength(80)]],
            description: [null, [Validators.maxLength(300)]],
            commissionValue: [null, [Validators.required, Validators.min(0)]],
            imageUrl: [null],
            isOrderLimit: [null],
            status: [null],
        });
    }

    private _patchValue(value: Category) {
        this.form.patchValue({
            id: value.id,
            name: value.name,
            description: value.description,
            imageUrl: value.imageUrl,
            commissionValue: value?.commission?.commisionValue,
            isOrderLimit: value.isOrderLimit,
            status: value.status,
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

    create(): void {
        this._categoryService
            .createCategory(this.form.value)
            .pipe(
                map(() => {
                    // Get the note
                    // this.cate$ = this._categoryService.category$;
                    this.showFlashMessage('success');
                })
            )
            .subscribe();

        setTimeout(() => {
            this._matDialogRef.close();
        }, 3100);
    }

    update(): void {
        this._categoryService
            .updateCategory(this.form.get('id').value, this.form.value)
            .pipe(
                map(() => {
                    // Get the note
                    // this.cate$ = this._categoryService.category$;
                    this.showFlashMessage('success');
                })
            )
            .subscribe();

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

        this._categoryService.uploadImage(file).subscribe((res) => {
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

        // if (file) {
        //     const reader = new FileReader();
        //     reader.readAsDataURL(file);
        //     reader.onload = () => {
        //         const base64String = reader.result?.toString().split(',')[1];
        //         this.cateChanged.imageUrl = 'data:image/png;base64,' + base64String;
        //     };
        // } // const allowedTypes = ['image/jpeg', 'image/png'];
        // const file = fileList[0];

        // // Return if the file is not allowed
        // if (!allowedTypes.includes(file.type)) {
        //     return;
        // }

        // this._readAsDataURL(file).then((data) => {

        //     // Update the image
        //     cate.imageUrl = data;

        //     // Update the note
        //     this.cateChanged.next(cate);
        // });
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
    removeImage(cate: Category): void {
        cate.imageUrl = null;

        // Update the cate
        this.cateChanged.next(cate);
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
