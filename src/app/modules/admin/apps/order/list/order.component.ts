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
import {Order, OrderPagination, WeddingInformation} from "../order.types";
import {OrderService} from "../order.service";
import {MatDialog} from "@angular/material/dialog";
import {OrderDetailsComponent} from "../detail/details.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Category} from "../../category/category.types";
import { Route, Router } from '@angular/router';
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
    selector: 'service-list',
    templateUrl: './order.component.html',
    styles: [
        /* language=SCSS */
        `
            .order-grid {
                grid-template-columns: 100px 120px auto 150px 150px 150px 150px 80px;

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
export class OrderListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('pendingItems') private _pendingPaginator: MatPaginator;
    @ViewChild('doingItems') private _doingPaginator: MatPaginator;
    @ViewChild('doneItems') private _donePaginator: MatPaginator;
    @ViewChild('cancelledItems') private _cancelledPaginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    pendingItems$: Observable<Order[]>;
    doingItems$: Observable<Order[]>;
    doneItems$: Observable<Order[]>;
    cancelledItems$: Observable<Order[]>;
    weddingInfos$: Observable<WeddingInformation[]>;

    parentCategories$: Observable<Order[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pendingPagination: OrderPagination;
    doingPagination: OrderPagination;
    donePagination: OrderPagination;
    cancelledPagination: OrderPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedCategory: Order | null = null;
    selectedCategoryForm: UntypedFormGroup;
    isNew: boolean = false;
    selectedTab: number = 0;
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
        private _service: OrderService,
        private _router: Router,
        // private _route: Route
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the pagination
        this._service.pendingPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: OrderPagination) => {

                // Update the pagination
                this.pendingPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._service.doingPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: OrderPagination) => {

                // Update the pagination
                this.doingPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._service.donePagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: OrderPagination) => {

                // Update the pagination
                this.donePagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._service.cancelledPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: OrderPagination) => {

                // Update the pagination
                this.cancelledPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the products
        this.pendingItems$ = this._service.pendingItems$;
        this.doingItems$ = this._service.doingItems$;
        this.doneItems$ = this._service.doneItems$;
        this.cancelledItems$ = this._service.cancelledItems$;

        // this.weddingInfos$ = this._service.weddings$;

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    switch (this.selectedTab) {
                        case 0:
                            return this._service.getDoingItems(0, 10, 'CreateDate', 'desc', query);
                        case 1:
                            return this._service.getPendingItems(0, 10, 'CreateDate', 'desc', query);
                        case 2:
                            return this._service.getDoneItems(0, 10, 'CreateDate', 'desc', query);
                        case 3:
                            return this._service.getCancelledItems(0, 10, 'CreateDate', 'desc', query);
                    }
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
        if (this._sort && this._pendingPaginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'CreateDate',
                start: 'desc',
                disableClear: true
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._pendingPaginator.pageIndex = 0;

                    // Close the details
                    // this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._pendingPaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getPendingItems(this._pendingPaginator.pageIndex, this._pendingPaginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }

        if (this._sort && this._doingPaginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'CreateDate',
                start: 'desc',
                disableClear: true
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._doingPaginator.pageIndex = 0;

                    // Close the details
                    // this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._doingPaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getDoingItems(this._doingPaginator.pageIndex, this._doingPaginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }

        if (this._sort && this._donePaginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'CreateDate',
                start: 'desc',
                disableClear: true
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._donePaginator.pageIndex = 0;

                    // Close the details
                    // this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._donePaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getDoingItems(this._donePaginator.pageIndex, this._donePaginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }

        if (this._sort && this._cancelledPaginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'CreateDate',
                start: 'desc',
                disableClear: true
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._cancelledPaginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._cancelledPaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getCancelledItems(this._cancelledPaginator.pageIndex, this._cancelledPaginator.pageSize, this._sort.active, this._sort.direction);
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

    // toggleDetails(productId: string): void {
    //     // If the product is already selected...
    //     if (this.selectedCategory && this.selectedCategory.id === productId) {
    //         // Close the details
    //         this.closeDetails();
    //         return;
    //     }

    //     // Get the product by id
    //     this._service.getItem(productId)
    //         .subscribe((item) => {

    //             // Set the selected item
    //             this.selectedCategory = item;

    //             // Fill the form
    //             this.selectedCategoryForm.patchValue(item);
    //             // Mark for check
    //             this._changeDetectorRef.markForCheck();
    //         });
    // }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedCategory = null;
    }

    // createItem(): void {
    //     // Create the product
    //     this._matDialog.open(OrderDetailsComponent, {
    //         autoFocus: false,
    //         data: {
    //             service: {}
    //         },
    //         width: '50vw',
    //     });
    // }

    // update(id: string): void {
    //     this._service.getItem(id)
    //         .subscribe((item) => {
    //             this.selectedCategory = item;

    //             this._matDialog.open(OrderDetailsComponent, {
    //                 autoFocus: false,
    //                 data: {
    //                     service: this.selectedCategory
    //                 },
    //                 width: '50vw',
    //             });
    //             // Mark for check
    //             this._changeDetectorRef.markForCheck();
    //         });
    // }

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
                // this._service.delete(id).subscribe(() => {
                //     this.openSnackBar('Xóa thành công', 'Đóng');
                //     // Close the details
                //     this.closeDetails();
                // });
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

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    onTabChange(event: MatTabChangeEvent): void {
        this.selectedTab = event.index
    }
}
