import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {map, Observable, of, Subject} from 'rxjs';
import {Label} from 'app/modules/admin/apps/notes/notes.types';
import {Service} from "../service.types";
import {ServiceService} from "../service.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {Category} from "../../category/category.types";
import {environment} from "../../../../../../environments/environment";
import {DomSanitizer} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FuseConfirmationService} from "../../../../../../@fuse/services/confirmation";
import {Account} from "../../user/user.types";
import {OrderService} from "../../order/order.service";

@Component({
    selector: 'category-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class ServiceDetailsComponent implements OnInit, OnDestroy {
    flashMessage: 'success' | 'error' | null = null;
    labels$: Observable<Label[]>;
    itemChanged: Subject<Service> = new Subject<Service>();
    item$: Observable<Service>;
    categories$: Observable<Category[]>;
    imgDataOrLink: any;
    tempImageUrls: string[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    users: Account[];

    form: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fb: FormBuilder,
        private sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) public _data: { service: Service, type: string },
        private _service: ServiceService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar,
        private _matDialog: MatDialog,
        private _matDialogRef: MatDialogRef<ServiceDetailsComponent>,
        private _orderService: OrderService,

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

            if(this._data.type === 'owner') {
                this._service.getOwnerItem(this._data.service.id).subscribe();

                // Get the note
                this.item$ = this._service.ownerItem$;
            } else if(this._data.type === 'partner') {
                this._service.getPartnerItem(this._data.service.id).subscribe();

                // Get the note
                this.item$ = this._service.partnerItem;
            }


            this.item$.subscribe((value) => {
                this._patchValue(value);
            });
        }
        // Add
        else {
            console.log("Add");
            // Create an empty note
            const item: Service = {
                ownerId: "", quantity: "",
                id: null,
                name: '',
                description: '',
                serviceImages: null,
                categoryId: null,
                isOwnerService: true,
                status: 'Active'
            };

            this.item$ = of(item);
        }

        this._orderService.users$.subscribe(data => {
            this.users = data;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        })
    }

    private _initForm(): void {
        this.form = this._fb.group({
            id: [null],
            name: [null, [Validators.required, Validators.maxLength(80)]],
            categoryId: [null],
            description: [null, Validators.maxLength(1000)],
            ownerId: [null],
            quantity: [null, Validators.required],
            unit: [null],
            price: [null, Validators.required],
            imageUrls: [[]],
            status: [true],
        });
    }

    getPartnerName(id: string) {
        const user = this.users.find(x => x.id === id);
        return user.user?.fullname || '';
    }

    private _patchValue(value: Service) {
        var indexFirstImage = value.serviceImages.findIndex(x => x.imageUrl === value.coverUrl);
        if(indexFirstImage >= 0) {
            var temp = value.serviceImages[0];
            value.serviceImages[0] = value.serviceImages[indexFirstImage];
            value.serviceImages[indexFirstImage] = temp;
        }
        this.form.patchValue({
            id: value.id,
            name: value.name,
            categoryId: value.categoryId,
            description: value.description,
            ownerId: value.ownerId,
            quantity: value.quantity,
            unit: value.unit,
            price: value.currentPrices?.price,
            imageUrls: value.serviceImages.map((image) => image.imageUrl),
            status: value.status === 'Active',
        });
        this.tempImageUrls = value.serviceImages.map((image) => image.imageUrl);
        console.log(this.tempImageUrls)
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

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action);
    }

    public changeStatusPartner(event: any): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Xác nhận đổi trạng thái',
            message: 'Bạn có muốn đổi trạng thái loại dịch vụ này?!',
            icon:{
                show: true,
                color: "primary"
            },
            actions: {
                confirm: {
                    label: 'Xác nhận',
                    color: 'primary'
                },
                cancel: {
                    label: 'Đóng'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                console.log(event.checked);
                const ccc = this._service.changeStatusPartner(this.form.get('id').value, event.checked ? 'Active' : 'InActive').subscribe(() => {
                    this.openSnackBar('Đã đổi trạng thái', 'Đóng');
                    ccc.unsubscribe();
                    this._matDialogRef.close();
                    // Close the details
                    // this.closeDetails();
                });
            } else {
                this.form.patchValue({
                    status: !event.checked,
                });
            }
        });
    }

    public changeStatusOwner(event: any): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Xác nhận đổi trạng thái',
            message: 'Bạn có muốn đổi trạng thái loại dịch vụ này?!',
            icon:{
                show: true,
                color: "primary"
            },
            actions: {
                confirm: {
                    label: 'Xác nhận',
                    color: 'primary'
                },
                cancel: {
                    label: 'Đóng'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                console.log(event.checked);
                const ccc = this._service.changeStatusOwner(this.form.get('id').value, event.checked ? 'Active' : 'InActive').subscribe(() => {
                    this.openSnackBar('Đã đổi trạng thái', 'Đóng');
                    ccc.unsubscribe();
                    this._matDialogRef.close();
                    // Close the details
                    // this.closeDetails();
                });
            } else {
                this.form.patchValue({
                    status: !event.checked,
                });
            }
        });
    }

    create(): void {
        this._service.create(this.form.value).pipe(
            map(() => {
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
            this.tempImageUrls.push(res);
            this.form.patchValue({imageUrls: this.tempImageUrls})
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.imgDataOrLink = this.mapImageUrl(res);
                this._changeDetectorRef.markForCheck();
            };
            // this.imgDataOrLink = this.mapImageUrl(res);
        });
        // Return if canceled
        // if (!fileList.length) {
        //     return;
        // }
        //
        // const allowedTypes = ['image/jpeg', 'image/png'];
        // const file = fileList[0];
        //
        // // Return if the file is not allowed
        // if (!allowedTypes.includes(file.type)) {
        //     return;
        // }
        //
        // this._readAsDataURL(file).then((data) => {
        //
        //     // Update the image
        //     // cate.coverUrl = data;
        //
        //     // Update the note
        //     this.itemChanged.next(cate);
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
    removeImage(index: number): void {
        this.tempImageUrls.splice(index, 1);
        this.form.patchValue({imageUrls: this.tempImageUrls})
    }

    clearImage(): void {
        this.tempImageUrls = [];
        this.form.patchValue({imageUrls: this.tempImageUrls})
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
