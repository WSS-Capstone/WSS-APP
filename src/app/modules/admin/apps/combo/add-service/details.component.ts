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
import {Service} from "../../service/service.types";
import {ServiceService} from "../../service/service.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {Category} from "../../category/category.types";
import {environment} from "../../../../../../environments/environment";
import {DomSanitizer} from "@angular/platform-browser";
import { ComboService } from '../combo.service';

@Component({
    selector: 'category-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class AddServiceComponent implements OnInit, OnDestroy {
    flashMessage: 'success' | 'error' | null = null;
    labels$: Observable<Label[]>;
    itemChanged: Subject<Service> = new Subject<Service>();
    item$: Observable<Service>;
    categories$: Observable<Category[]>;
    services: Service[];
    imgDataOrLink: any;
    newServices: string[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    form: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fb: FormBuilder,
        private sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) private _data: { addedService: string[] },
        private _service: ServiceService,
        private _comboService: ComboService,
        private _matDialogRef: MatDialogRef<AddServiceComponent>
    ) {
        // this._initForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.newServices = [];
        this.categories$ = this._comboService.categories$;
        this._comboService.services$.subscribe(data => {
            this.services = this._data.addedService.length > 0 ? data.filter(x => !this._data.addedService.includes(x.id)) : data;
        });
    }

    // private _initForm(): void {
    //     this.form = this._fb.group({
    //         id: [null],
    //         name: [null],
    //         categoryId: [null],
    //         description: [null],
    //         ownerId: [null],
    //         quantity: [null],
    //         price: [null],
    //         imageUrls: [[]],
    //         status: [null],
    //     });
    // }

    // private _patchValue(value: Service) {
    //     this.form.patchValue({
    //         id: value.id,
    //         name: value.name,
    //         categoryId: value.categoryId,
    //         description: value.description,
    //         ownerId: value.ownerId,
    //         quantity: value.quantity,
    //         price: value.currentPrices?.price,
    //         imageUrls: value.serviceImages.map((image) => image.imageUrl),
    //         status: value.status,
    //     });
    //     this.tempImageUrls = value.serviceImages.map((image) => image.imageUrl);
    //     console.log(this.tempImageUrls)
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

    add(id: string) {
        this.newServices.push(id);
    }

    remove(id: string) {
        this.newServices.slice(this.newServices.findIndex(x => x === id), 1);
    }

    create(): void {
        console.log(this.newServices)
        // this._service.create(this.form.value).pipe(
        //     map(() => {
        //         this.showFlashMessage('success');
        //     })).subscribe();
        //
        // setTimeout(() => {
        //     this._matDialogRef.close();
        // }, 3100);
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
    // uploadImage(event: any): void {
    //     // Return if canceled
    //     if (!event.target.files[0]) {
    //         return;
    //     }
    //
    //     const file = event.target.files[0];
    //     // send request upload file
    //
    //     this._service.uploadImage(file).subscribe((res) => {
    //         console.log('res', res);
    //         this.tempImageUrls.push(res);
    //         this.form.patchValue({imageUrls: this.tempImageUrls})
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => {
    //             this.imgDataOrLink = this.mapImageUrl(res);
    //             this._changeDetectorRef.markForCheck();
    //         };
    //         // this.imgDataOrLink = this.mapImageUrl(res);
    //     });
    //     // Return if canceled
    //     // if (!fileList.length) {
    //     //     return;
    //     // }
    //     //
    //     // const allowedTypes = ['image/jpeg', 'image/png'];
    //     // const file = fileList[0];
    //     //
    //     // // Return if the file is not allowed
    //     // if (!allowedTypes.includes(file.type)) {
    //     //     return;
    //     // }
    //     //
    //     // this._readAsDataURL(file).then((data) => {
    //     //
    //     //     // Update the image
    //     //     // cate.coverUrl = data;
    //     //
    //     //     // Update the note
    //     //     this.itemChanged.next(cate);
    //     // });
    // }

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
    // removeImage(index: number): void {
    //     this.tempImageUrls.splice(index, 1);
    //     this.form.patchValue({imageUrls: this.tempImageUrls})
    // }
    //
    // clearImage(): void {
    //     this.tempImageUrls = [];
    //     this.form.patchValue({imageUrls: this.tempImageUrls})
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
