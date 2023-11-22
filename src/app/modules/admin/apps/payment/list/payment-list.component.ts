import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {debounceTime, map, merge, Observable, Subject, switchMap, takeUntil} from 'rxjs';
import {fuseAnimations} from '@fuse/animations';
import {FuseConfirmationService} from '@fuse/services/confirmation';
import {Payment, PaymentPagination} from "../payment.types";
import {PaymentService} from "../payment.service";
import {MatDialog} from "@angular/material/dialog";
import {PaymentDetailsComponent} from "../detail/details.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Category} from "../../category/category.types";
import {AccountRequest} from "../../user/user.types";

@Component({
    selector: 'payment-list',
    templateUrl: './payment-list.component.html',
    styles: [
        /* language=SCSS */
        `
            .payment-grid {
                grid-template-columns: 220px 100px auto 160px 130px 160px 180px 75px;

                /* @screen sm {
                    grid-template-columns: 57px auto 80px;
                }

                @screen md {
                    grid-template-columns: 56px 126px auto 80px;
                }

                @screen lg {
                    grid-template-columns: 56px 126px 84px 67px auto 80px;
                }  */
            }
        `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class PaymentListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    readonly MAX_RATING = 5;

    items$: Observable<Payment[]>;
    categories$: Observable<Category[]>;

    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: PaymentPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedCategory: Payment | null = null;
    selectedCategoryForm: UntypedFormGroup;
    isNew: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private _matDialog: MatDialog,
        private _service: PaymentService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the selected product form
        // this.selectedCategoryForm = this._formBuilder.group({
        //     id: [''],
        //     name: ['', [Validators.required]],
        //     description: [''],
        //     imageUrl: [''],
        //     categoryId: [''],
        //     images: [[]],
        //     currentImageIndex: [0], // Image index that is currently being viewed
        // });

        // Get the pagination
        this._service.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: PaymentPagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the products
        this.items$ = this._service.items$;

        // this.categories$ = this._service.categories$;

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getItems(0, 10, 'name', 'asc', query);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 1;

                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getItems(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    numSequence(n: number): Array<number> {
        return Array(n);
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedCategory = null;
    }

    pay(id: string): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Xác nhận thanh toán',
            message: 'Bạn có muốn thanh toán đơn hàng này?!',
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
                console.log(result);
                const ccc = this._service.patch(id, 'ACTIVE').subscribe(() => {
                    this.openSnackBar('Đã thanh toán đơn hàng', 'Đóng');
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
                    this.openSnackBar('Đã ẩn bình luận', 'Đóng');
                    ccc.unsubscribe();
                    // Close the details
                    // this.closeDetails();
                });
            }
        });
    }

    update(id: string): void {
        this._service.getItem(id)
            .subscribe((item) => {
                this.selectedCategory = item;

                this._matDialog.open(PaymentDetailsComponent, {
                    autoFocus: false,
                    data: {
                        service: this.selectedCategory
                    },
                    width: '50vw',
                });
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    delete(id: string): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Xóa loại dịch vụ',
            message: 'Bạn có chắc chắn muốn xóa loại dịch vụ này?!',
            actions: {
                confirm: {
                    label: 'Xóa'
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
                console.log(id);
                // Delete the product on the server
                this._service.delete(id).subscribe(() => {
                    this.openSnackBar('Xóa thành công', 'Đóng');
                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

    /**
     * Show flash message
     */
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
        }, 3000);
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action);
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
}
