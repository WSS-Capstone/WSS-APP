import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {map, Observable, Subject} from "rxjs";
import {Label} from "../../notes/notes.types";
import {Account, AccountRequest} from "../user.types";
import {Category} from "../../category/category.types";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../user.service";
import {environment} from "../../../../../../environments/environment";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector       : 'create-account',
    templateUrl    : './create-account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class CreateAccountComponent implements OnInit, OnDestroy
{
    flashMessage: 'success' | 'error' | null = null;
    labels$: Observable<Label[]>;
    itemChanged: Subject<Account> = new Subject<Account>();
    item$: Observable<Account>;
    categories$: Observable<Category[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    imgDataOrLink: any;
    roles = ['Admin', 'Owner', 'Staff', 'Partner', 'Customer']
    form: FormGroup;
    tempImageUrls: string;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fb: FormBuilder,
        private sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) private _data: { data: Account },
        private _service: UserService,
        private _matDialogRef: MatDialogRef<CreateAccountComponent>
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
    }

    private _initForm(): void {
        this.form = this._fb.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required, Validators.minLength(6)]],
            confirmPassword: [null, [Validators.required, Validators.minLength(6), matchOtherValidator("password")]],
            fullname: [null, [Validators.required]],
            dateOfBirth: [null, [Validators.required]],
            phone: [null, [Validators.required, Validators.pattern(/^[1-9]{9}$/)]],
            address: [null, [Validators.required, Validators.maxLength(300)]],
            gender: [null, [Validators.required]],
            imageUrl: [null],
            categoryId: [null, [Validators.required]],
            roleName: [null, [Validators.required]],
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

    checkMatchValidator(field1: string, field2: string) {
        return function (frm) {
            let field1Value = frm.get(field1).value;
            let field2Value = frm.get(field2).value;

            if (field1Value !== '' && field1Value !== field2Value) {
                return { 'match': `value ${field1Value} is not equal to ${field2Value}` }
            }
            return null;
        }
    }

    create(): void {
        // this.form.patchValue({
        //     phone: '+84' + this.form.get('phone').value
        // });
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
        const requestBody:AccountRequest = {
            email: this.form.get('email').value,
            password: this.form.get('password').value,
        }
        this._service.update(this.form.get('id').value, requestBody).pipe(
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
        if (!event.target.files[0]) {
            return;
        }

        const file = event.target.files[0];
        // send request upload file

        this._service.uploadImage(file).subscribe((res) => {
            console.log('res', res);
            this.tempImageUrls = res;
            this.form.patchValue({imageUrls: this.tempImageUrls})
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
    // removeImage(cate: Account): void {
    //     cate.imageUrl = null;
    //
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

export function matchOtherValidator (otherControlName: string) {

    let thisControl: FormControl;
    let otherControl: FormControl;

    return function matchOtherValidate(control: FormControl) {

        if (!control.parent) {
            return null;
        }

        // Initializing the validator.
        if (!thisControl) {
            thisControl = control;
            otherControl = control.parent.get(otherControlName) as FormControl;
            if (!otherControl) {
                throw new Error('matchOtherValidator(): other control is not found in parent group');
            }
            otherControl.valueChanges.subscribe(() => {
                thisControl.updateValueAndValidity();
            });
        }

        if (!otherControl) {
            return null;
        }

        if (otherControl.value !== thisControl.value) {
            return {
                matchOther: true
            };
        }

        return null;

    }
}
