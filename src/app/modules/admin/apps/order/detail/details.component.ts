import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {map, Observable, Subject} from 'rxjs';
import {Label} from 'app/modules/admin/apps/notes/notes.types';
import {Order, OrderDetail, WeddingInformation} from "../order.types";
import {OrderService} from "../order.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {ActivatedRoute} from '@angular/router';
import {Discount} from "../../discount/discount.types";
import {FuseConfirmationService} from "../../../../../../@fuse/services/confirmation";
import {OrderCreateTaskComponent} from '../create-task/details.component';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'order-details',
    templateUrl: './details.component.html',
    styles: [
        /* language=SCSS */
        `
            .order-detail-grid {
                grid-template-columns: 8% auto 9% 8% 9% 10% 6%;
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
    weddingInfo$: Observable<WeddingInformation>;
    voucher$: Observable<Discount>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    form: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fb: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _service: OrderService,
        private _matDialog: MatDialog,
        private acitvatedRoute: ActivatedRoute,
        private _snackBar: MatSnackBar,
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
                this.item$ = this._service.item$.pipe(
                    map(value => {
                        let r = structuredClone(value);
                        r.orderDetails = r.orderDetails.concat(r.comboOrderDetails);
                        return r;
                    })
                );

                this.isLoading = false;
                this._changeDetectorRef.markForCheck();
            });

          })

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

    createTask(orderDetail: OrderDetail) {
        this._matDialog.open(OrderCreateTaskComponent, {
            autoFocus: false,
            data: {
                orderDetail: orderDetail
            },
            width: '50vw',
        });
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    updateStatus(id: string, status: string, text: string, currentStatus: string) {
        const confirmation = this._fuseConfirmationService.open({
            title: text + ' đơn hàng',
            message: `Bạn có chắc chắn muốn ${text.toLowerCase()} này?!`,
            icon:{
                show: true,
                color: "primary"
            },
            actions: {
                confirm: {
                    label: text,
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
                const cccc = this._service.approval(id, status, currentStatus).subscribe(() => {
                    this.openSnackBar(`${text} thành công`, 'Đóng');
                    cccc.unsubscribe();
                    this._changeDetectorRef.markForCheck();
                });
            }
        });
    }

    cancelOrder(id: string, status: string, text: string, currentStatus: string) {
        const confirmation = this._fuseConfirmationService.open({
            title: text + ' đơn hàng',
            message: `Bạn có chắc chắn muốn ${text.toLowerCase()} này?!`,
            icon:{
                show: true,
                color: "primary"
            },
            input: {
                label: 'Lý do',
                value: null
            },
            actions: {
                confirm: {
                    label: text,
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
            if (result != null && result !== 'cancelled') {
                console.log(result);
                const cccc = this._service.approval(id, status, currentStatus, result).subscribe(() => {
                    this.openSnackBar(`${text} thành công`, 'Đóng');
                    cccc.unsubscribe();
                    this._changeDetectorRef.markForCheck();
                });
            }
        });
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action);
    }

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

    fnCalculateNumOfPeopleDo(tasks: any[]): number {
        return tasks.filter(x => x.status === 1).length;
    }

    showDone(item: Order){
        return item.orderDetails.every(x => x.status === 'DONE');
    }
}
