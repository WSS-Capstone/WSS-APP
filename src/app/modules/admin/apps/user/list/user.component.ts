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
import {Account, AccountPagination, AccountRequest} from "../user.types";
import {UserService} from "../user.service";
import {MatDialog} from "@angular/material/dialog";
import {UserDetailsComponent} from "../detail/details.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Category} from "../../category/category.types";
import {ChangePasswordComponent} from "../change-password/change-password.component";
import {CreateAccountComponent} from "../create-account/create-account.component";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
    selector: 'user-list',
    templateUrl: './user.component.html',
    styles: [
        /* language=SCSS */
        `
            .user-grid {
                grid-template-columns: 124px auto 177px 124px 180px 154px;

                /* @screen sm {
                    grid-template-columns: 57px auto 80px;
                }

                @screen md {
                    grid-template-columns: 56px 126px auto 80px;
                }

                @screen lg {
                    grid-template-columns: 56px 126px 84px 67px auto 80px;
                } */
            }
        `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('ownerItems') private _ownerPaginator: MatPaginator;
    @ViewChild('partnerItems') private _partnerPaginator: MatPaginator;
    @ViewChild('staffItems') private _staffPaginator: MatPaginator;
    @ViewChild('customerItems') private _customerPaginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    ownerItems$: Observable<Account[]>;
    partnerItems$: Observable<Account[]>;
    staffItems$: Observable<Account[]>;
    customerItems$: Observable<Account[]>;
    categories$: Observable<Category[]>;

    parentCategories$: Observable<Account[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    ownerPagination: AccountPagination;
    partnerPagination: AccountPagination;
    staffPagination: AccountPagination;
    customerPagination: AccountPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedAccount: Account | null = null;
    selectedAccountForm: UntypedFormGroup;
    isNew: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    selectedTab = 0;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private _matDialog: MatDialog,
        private _service: UserService
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
        this.selectedAccountForm = this._formBuilder.group({
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
            .subscribe((pagination: AccountPagination) => {
                this.ownerPagination = pagination;
                this._changeDetectorRef.markForCheck();
            });

        this._service.partnerPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: AccountPagination) => {
                this.partnerPagination = pagination;
                this._changeDetectorRef.markForCheck();
            });

        this._service.staffPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: AccountPagination) => {
                this.staffPagination = pagination;
                this._changeDetectorRef.markForCheck();
            });

        this._service.customerPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: AccountPagination) => {
                this.customerPagination = pagination;
                this._changeDetectorRef.markForCheck();
            });

        // Get the products
        this.ownerItems$ = this._service.ownerItems$;
        this.partnerItems$ = this._service.partnerItems$;
        this.staffItems$ = this._service.staffItems$;
        this.customerItems$ = this._service.customerItems$;
        this.categories$ = this._service.categories$;

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
                            return this._service.getOwnerItems(0, 10, 'status', 'asc', query);
                        case 1:
                            return this._service.getPartnerItems(0, 10, 'status', 'asc', query);
                        case 2:
                            return this._service.getStaffItems(0, 10, 'status', 'asc', query);
                        case 3:
                            return this._service.getCustomerItems(0, 10, 'status', 'asc', query);
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
        if (this._sort && this._ownerPaginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'status',
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

        if (this._sort && this._partnerPaginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'status',
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

        if (this._sort && this._staffPaginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'status',
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
                    this._staffPaginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._staffPaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getStaffItems(this._staffPaginator.pageIndex, this._staffPaginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }

        if (this._sort && this._customerPaginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'status',
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
                    this._customerPaginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._customerPaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getCustomerItems(this._customerPaginator.pageIndex, this._customerPaginator.pageSize, this._sort.active, this._sort.direction);
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
    //     if (this.selectedAccount && this.selectedAccount.id === productId) {
    //         // Close the details
    //         this.closeDetails();
    //         return;
    //     }
    //
    //     // Get the product by id
    //     this._service.getItem(productId)
    //         .subscribe((item) => {
    //
    //             // Set the selected item
    //             this.selectedAccount = item;
    //
    //             // Fill the form
    //             this.selectedAccountForm.patchValue(item);
    //             // Mark for check
    //             this._changeDetectorRef.markForCheck();
    //         });
    // }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedAccount = null;
    }

    onTabChange(event: MatTabChangeEvent) {
        this.selectedTab = event.index
    }

    createItem(): void {
        this._matDialog.open(CreateAccountComponent, {
            autoFocus: false,
            data: { },
            width: '40vw',
        });
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    update(id: string, currentRole: string): void {
        switch (currentRole) {
            case 'Owner':
                this._service.getOwnerItem(id)
                    .subscribe((item) => {
                        this.selectedAccount = item;
                        this._matDialog.open(UserDetailsComponent, {
                            autoFocus: false,
                            data: {
                                data: this.selectedAccount,
                                currentRole: currentRole
                            },
                            width: '50vw',
                        });
                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    });
                break;
            case 'Partner':
                this._service.getPartnerItem(id)
                    .subscribe((item) => {
                        this.selectedAccount = item;
                        this._matDialog.open(UserDetailsComponent, {
                            autoFocus: false,
                            data: {
                                data: this.selectedAccount,
                                currentRole: currentRole
                            },
                            width: '50vw',
                        });
                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    });
                break;
            case 'Staff':
                this._service.getStaffItem(id)
                    .subscribe((item) => {
                        this.selectedAccount = item;
                        this._matDialog.open(UserDetailsComponent, {
                            autoFocus: false,
                            data: {
                                data: this.selectedAccount,
                                currentRole: currentRole
                            },
                            width: '50vw',
                        });
                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    });
                break;
            case 'Customer':
                this._service.getCustomerItem(id)
                    .subscribe((item) => {
                        this.selectedAccount = item;
                        this._matDialog.open(UserDetailsComponent, {
                            autoFocus: false,
                            data: {
                                data: this.selectedAccount,
                                currentRole: currentRole
                            },
                            width: '50vw',
                        });
                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    });
                break;
        }
    }

    block(id: string, email: string, currentRole: string): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Khóa tài khoản',
            message: 'Bạn có chắc chắn muốn khóa tài khoản này?!',
            input: {
                label: 'Lý do',
                value: null
            },
            actions: {
                confirm: {
                    label: 'Khóa'
                },
                cancel: {
                    label: 'Hủy'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            // if (result === 'confirmed') {
                console.log(result);
                // Delete the product on the server
                // this._service.delete(id).subscribe(() => {
                //     this.openSnackBar('Khóa thành công', 'Đóng');
                //     // Close the details
                //     this.closeDetails();
                // });
                const requestBody: AccountRequest = {
                    email: email,
                    reason: result,
                    status: "InActive"
                };
                this._service.update(id, requestBody, currentRole).subscribe(() => {
                    this.openSnackBar('Khóa thành công', 'Đóng');
                    // Close the details
                    this.closeDetails();
                });
            // }
        });
    }

    unblock(id: string, email: string, currentRole: string): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Mở khóa tài khoản',
            message: 'Bạn có chắc chắn muốn mở khóa tài khoản này?!',
            icon:{
                show: true,
                color: "primary"
            },
            actions: {
                confirm: {
                    label: 'Mở',
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
                const requestBody: AccountRequest = {
                    email: email,
                    status: "Active"
                };
                this._service.update(id, requestBody, currentRole).subscribe(() => {
                    this.openSnackBar('Mở khóa thành công', 'Đóng');
                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

    changePassword(id: string, currentRole: string){
        switch (currentRole) {
            case 'Owner':
                this._service.getOwnerItem(id)
                    .subscribe((item) => {
                        this.selectedAccount = item;

                        this._matDialog.open(ChangePasswordComponent, {
                            autoFocus: false,
                            data: {
                                data: this.selectedAccount,
                                currentRole: currentRole
                            },
                            width: '20vw',
                        });
                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    });
                break;
            case 'Partner':
                this._service.getPartnerItem(id)
                    .subscribe((item) => {
                        this.selectedAccount = item;

                        this._matDialog.open(ChangePasswordComponent, {
                            autoFocus: false,
                            data: {
                                data: this.selectedAccount,
                                currentRole: currentRole
                            },
                            width: '20vw',
                        });
                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    });
                break;
            case 'Staff':
                this._service.getStaffItem(id)
                    .subscribe((item) => {
                        this.selectedAccount = item;

                        this._matDialog.open(ChangePasswordComponent, {
                            autoFocus: false,
                            data: {
                                data: this.selectedAccount,
                                currentRole: currentRole
                            },
                            width: '20vw',
                        });
                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    });
                break;
            case 'Customer':
                this._service.getCustomerItem(id)
                    .subscribe((item) => {
                        this.selectedAccount = item;

                        this._matDialog.open(ChangePasswordComponent, {
                            autoFocus: false,
                            data: {
                                data: this.selectedAccount,
                                currentRole: currentRole
                            },
                            width: '20vw',
                        });
                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    });
                break;
        }
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
