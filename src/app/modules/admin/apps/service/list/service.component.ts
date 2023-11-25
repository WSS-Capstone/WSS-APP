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
import {Service, ServicePagination} from "../service.types";
import {ServiceService} from "../service.service";
import {MatDialog} from "@angular/material/dialog";
import {ServiceDetailsComponent} from "../detail/details.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Category} from "../../category/category.types";
import {ServiceApprovalDetailsComponent} from "../service-approval/details.component";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {OrderService} from "../../order/order.service";
import {Account} from "../../user/user.types";

@Component({
    selector: 'service-list',
    templateUrl: './service.component.html',
    styles: [
        /* language=SCSS */
        `
            .service-grid {
                grid-template-columns:  6% auto 13% 4% 9% 9% 5%;

                @screen sm {
                    grid-template-columns:  80px auto 80px;
                }

                @screen md {
                    grid-template-columns:  80px auto 218px 134px 80px 145px 80px;
                }

                @screen lg {
                    grid-template-columns:  6% auto 13% 4% 9% 9% 5%;
                }
            }

            .partner-service-grid {
                grid-template-columns:  6% auto 13% 11% 5% 9% 10% 5%;
            }

            .service-approval-grid {
                grid-template-columns: 80px auto 150px 180px 150px 80px;
            }

            .vh-70 {
                height: 66vh !important;
            }
        `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class ServiceListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('ownerPaginator') private _ownerPaginator: MatPaginator;
    @ViewChild('partnerPaginator') private _partnerPaginator: MatPaginator;
    @ViewChild('pendingPaginator') private _pendingPaginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    // items$: Observable<Service[]>;
    partnerServices$: Observable<Service[]>;
    ownerServices$: Observable<Service[]>;
    pendingServices$: Observable<Service[]>;

    // pagination: ServicePagination;
    partnerServicesPagination: ServicePagination;
    ownerServicesPagination: ServicePagination;
    pendingServicesPagination: ServicePagination;

    categories$: Observable<Category[]>;
    users: Account[];

    parentCategories$: Observable<Service[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedCategory: Service | null = null;
    selectedCategoryForm: UntypedFormGroup;
    isNew: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    selectedTab: number = 0;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private _matDialog: MatDialog,
        private _service: ServiceService,
        private _orderService: OrderService,
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
        this.selectedCategoryForm = this._formBuilder.group({
            id: [''],
            name: ['', [Validators.required]],
            description: [''],
            imageUrl: [''],
            categoryId: [''],
            images: [[]],
            currentImageIndex: [0], // Image index that is currently being viewed
        });

        // Get the pagination
        this._service.ownerPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: ServicePagination) => {

                // Update the pagination
                this.ownerServicesPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._service.partnerPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: ServicePagination) => {

                // Update the pagination
                this.partnerServicesPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._service.pendingPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: ServicePagination) => {

                // Update the pagination
                this.pendingServicesPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the products
        // this.items$ = this._service.items$;
        this.partnerServices$ = this._service.partnerItems$;
        this.ownerServices$ = this._service.ownerItems$;
        this.pendingServices$ = this._service.pendingItems$;

        this.categories$ = this._service.categories$;
        this._orderService.users$.subscribe(data => {
            this.users = data;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        })

        //Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    switch (this.selectedTab) {
                        case 0:
                            return this._service.getPartnerItems(0, 10, 'status', 'asc', query);
                        case 1:
                            return this._service.getOwnerItems(0, 10, 'status', 'asc', query);
                        case 2:
                            return this._service.getPendingItems(0, 10, 'status', 'asc', query);
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
        //partner
        if (this._sort && this._partnerPaginator) {
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
                    this._partnerPaginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._partnerPaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getPartnerItems(this._partnerPaginator.pageIndex, this._partnerPaginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }

        //owner
        if (this._sort && this._ownerPaginator) {
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
                    this._ownerPaginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._ownerPaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getOwnerItems(this._ownerPaginator.pageIndex, this._ownerPaginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }

        //pending
        if (this._sort && this._pendingPaginator) {
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
                    this._pendingPaginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
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
        }
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    toggleDetails(productId: string): void {
        // If the product is already selected...
        // if (this.selectedCategory && this.selectedCategory.id === productId) {
        //     // Close the details
        //     this.closeDetails();
        //     return;
        // }
        //
        // // Get the product by id
        // this._service.getItem(productId)
        //     .subscribe((item) => {
        //
        //         // Set the selected item
        //         this.selectedCategory = item;
        //
        //         // Fill the form
        //         this.selectedCategoryForm.patchValue(item);
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });
    }

    getPartnerName(id: string) {
        const user = this.users.find(x => x.id === id);
        return user.user?.fullname || '';
    }

    onTabChange(event: MatTabChangeEvent): void {
        this.selectedTab = event.index
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedCategory = null;
    }

    createItem(): void {
        // Create the product
        this._matDialog.open(ServiceDetailsComponent, {
            autoFocus: false,
            data: {
                service: {}
            },
            width: '50vw',
        });
    }

    update(id: string, type: string): void {
        if(type === 'owner') {
            this._service.getOwnerItem(id)
                .subscribe((item) => {
                    this.selectedCategory = item;

                    this._matDialog.open(ServiceDetailsComponent, {
                        autoFocus: false,
                        data: {
                            service: this.selectedCategory,
                            type: type
                        },
                        width: '50vw',
                    });
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });
        } else if(type === 'partner') {
            this._service.getPartnerItem(id)
                .subscribe((item) => {
                    this.selectedCategory = item;

                    this._matDialog.open(ServiceDetailsComponent, {
                        autoFocus: false,
                        data: {
                            service: this.selectedCategory,
                            type: type
                        },
                        width: '50vw',
                    });
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });
        } else if(type === 'pending') {
            this._service.getPendingItem(id)
                .subscribe((item) => {
                    this.selectedCategory = item;

                    this._matDialog.open(ServiceDetailsComponent, {
                        autoFocus: false,
                        data: {
                            service: this.selectedCategory,
                            type: type
                        },
                        width: '50vw',
                    });
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });
        }
    }

    delete(id: string, type: string): void {
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
                this._service.delete(id, type).subscribe(() => {
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

    approvalService(id: string): void {
        this._service.getPendingItem(id)
            .subscribe((item) => {
                this.selectedCategory = item;

                this._matDialog.open(ServiceApprovalDetailsComponent, {
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
}
