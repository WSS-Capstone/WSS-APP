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
import {debounceTime, filter, map, merge, Observable, Subject, switchMap, takeUntil} from 'rxjs';
import {fuseAnimations} from '@fuse/animations';
import {FuseConfirmationService} from '@fuse/services/confirmation';
import {Task, TaskPagination} from "../task.types";
import {TaskService} from "../task.service";
import {MatDialog} from "@angular/material/dialog";
import {TaskDetailsComponent} from "../detail/details.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Category} from "../../category/category.types";
import {filters} from "../../../../../mock-api/apps/mailbox/data";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
    selector: 'task-list',
    templateUrl: './task.component.html',
    styles: [
        /* language=SCSS */
        `
            .task-grid {
                grid-template-columns: 5% auto 11% 12% 15% 6% 6% 8% 5%;
            }

            .vh-70 {
                height: 66vh !important;
            }

            .mat-mdc-tab-body-wrapper .mat-mdc-tab-body-content {
                padding: 0 !important;
            }
        `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class TaskListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('ownerExpectedPaginator') private _ownerExpectedPaginator: MatPaginator;
    @ViewChild('ownerToDoPaginator') private _ownerToDoPaginator: MatPaginator;
    @ViewChild('ownerInProgressPaginator') private _ownerInProgressPaginator: MatPaginator;
    @ViewChild('ownerDonePaginator') private _ownerDonePaginator: MatPaginator;
    @ViewChild('ownerCancelPaginator') private _ownerCancelPaginator: MatPaginator;
    @ViewChild('partnerExpectedPaginator') private _partnerExpectedPaginator: MatPaginator;
    @ViewChild('partnerToDoPaginator') private _partnerToDoPaginator: MatPaginator;
    @ViewChild('partnerInProgressPaginator') private _partnerInProgressPaginator: MatPaginator;
    @ViewChild('partnerDonePaginator') private _partnerDonePaginator: MatPaginator;
    @ViewChild('partnerCancelPaginator') private _partnerCancelPaginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    partnerExpectedItems$: Observable<Task[]>;
    partnerToDoItems$: Observable<Task[]>;
    partnerInProgressItems$: Observable<Task[]>;
    partnerDoneItems$: Observable<Task[]>;
    partnerCancelItems$: Observable<Task[]>;
    ownerExpectedItems$: Observable<Task[]>;
    ownerToDoItems$: Observable<Task[]>;
    ownerInProgressItems$: Observable<Task[]>;
    ownerDoneItems$: Observable<Task[]>;
    ownerCancelItems$: Observable<Task[]>;
    categories$: Observable<Category[]>;

    parentCategories$: Observable<Task[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    ownerExpectedPagination: TaskPagination;
    ownerToDoPagination: TaskPagination;
    ownerInProgressPagination: TaskPagination;
    ownerDonePagination: TaskPagination;
    ownerCancelPagination: TaskPagination;
    partnerExpectedPagination: TaskPagination;
    partnerToDoPagination: TaskPagination;
    partnerInProgressPagination: TaskPagination;
    partnerDonePagination: TaskPagination;
    partnerCancelPagination: TaskPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedCategory: Task | null = null;
    selectedCategoryForm: UntypedFormGroup;
    isNew: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    selectedTab = 0;
    selectedOwnerSubTab = 0;
    selectedPartnerSubTab = 0;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private _matDialog: MatDialog,
        private _service: TaskService
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
        this._service.partnerExpectedPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: TaskPagination) => {

                // Update the pagination
                this.partnerExpectedPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._service.partnerToDoPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: TaskPagination) => {

                // Update the pagination
                this.partnerToDoPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._service.partnerInProgressPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: TaskPagination) => {

                // Update the pagination
                this.partnerInProgressPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._service.partnerDonePagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: TaskPagination) => {

                // Update the pagination
                this.partnerDonePagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._service.partnerCancelPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: TaskPagination) => {

                // Update the pagination
                this.partnerCancelPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._service.ownerExpectedPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: TaskPagination) => {

                // Update the pagination
                this.ownerExpectedPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._service.ownerToDoPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: TaskPagination) => {

                // Update the pagination
                this.ownerToDoPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._service.ownerInProgressPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: TaskPagination) => {

                // Update the pagination
                this.ownerInProgressPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._service.ownerDonePagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: TaskPagination) => {

                // Update the pagination
                this.ownerDonePagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._service.ownerCancelPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: TaskPagination) => {

                // Update the pagination
                this.ownerCancelPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


        // Get the products
        this.partnerExpectedItems$ = this._service.partnerExpectedItems$;
        this.partnerToDoItems$ = this._service.partnerToDoItems$;
        this.partnerInProgressItems$ = this._service.partnerInProgressItems$;
        this.partnerDoneItems$ = this._service.partnerDoneItems$;
        this.partnerCancelItems$ = this._service.partnerCancelItems$;
        this.ownerExpectedItems$ = this._service.ownerExpectedItems$;
        this.ownerToDoItems$ = this._service.ownerToDoItems$;
        this.ownerInProgressItems$ = this._service.ownerInProgressItems$;
        this.ownerDoneItems$ = this._service.ownerDoneItems$;
        this.ownerCancelItems$ = this._service.ownerCancelItems$;

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;

                    if(this.selectedTab === 0){
                        switch (this.selectedPartnerSubTab) {
                            case 0:
                                return this._service.getPartnerExpectedItems(0, 10, 'StartDate', 'desc', query);
                            case 1:
                                return this._service.getPartnerToDoItems(0, 10, 'StartDate', 'desc', query);
                            case 2:
                                return this._service.getPartnerInProgressItems(0, 10, 'StartDate', 'desc', query);
                            case 3:
                                return this._service.getPartnerDoneItems(0, 10, 'StartDate', 'desc', query);
                            case 4:
                                return this._service.getPartnerCancelItems(0, 10, 'StartDate', 'desc', query);
                        }
                    } else if(this.selectedTab === 1){
                        switch (this.selectedOwnerSubTab) {
                            case 0:
                                return this._service.getOwnerExpectedItems(0, 10, 'StartDate', 'desc', query);
                            case 1:
                                return this._service.getOwnerToDoItems(0, 10, 'StartDate', 'desc', query);
                            case 2:
                                return this._service.getOwnerInProgressItems(0, 10, 'StartDate', 'desc', query);
                            case 3:
                                return this._service.getOwnerDoneItems(0, 10, 'StartDate', 'desc', query);
                            case 4:
                                return this._service.getOwnerCancelItems(0, 10, 'StartDate', 'desc', query);
                        }
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
        if (this._sort && this._partnerExpectedPaginator) {
            this._sort.sort({
                id: 'StartDate',
                start: 'desc',
                disableClear: true
            });
            this._changeDetectorRef.markForCheck();
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    this._partnerExpectedPaginator.pageIndex = 0;
                    this.closeDetails();
                });
            merge(this._sort.sortChange, this._partnerExpectedPaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getPartnerExpectedItems(this._partnerExpectedPaginator.pageIndex, this._partnerExpectedPaginator.pageSize, this._sort.active, this._sort.start);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }

        if (this._sort && this._partnerToDoPaginator) {
            this._sort.sort({
                id: 'StartDate',
                start: 'desc',
                disableClear: true
            });
            this._changeDetectorRef.markForCheck();
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    this._partnerToDoPaginator.pageIndex = 0;
                    this.closeDetails();
                });
            merge(this._sort.sortChange, this._partnerToDoPaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getPartnerToDoItems(this._partnerToDoPaginator.pageIndex, this._partnerToDoPaginator.pageSize, this._sort.active, this._sort.start);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }

        if (this._sort && this._partnerInProgressPaginator) {
            this._sort.sort({
                id: 'StartDate',
                start: 'desc',
                disableClear: true
            });
            this._changeDetectorRef.markForCheck();
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    this._partnerInProgressPaginator.pageIndex = 0;
                    this.closeDetails();
                });
            merge(this._sort.sortChange, this._partnerInProgressPaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getPartnerInProgressItems(this._partnerInProgressPaginator.pageIndex, this._partnerInProgressPaginator.pageSize, this._sort.active, this._sort.start);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }

        if (this._sort && this._partnerDonePaginator) {
            this._sort.sort({
                id: 'StartDate',
                start: 'desc',
                disableClear: true
            });
            this._changeDetectorRef.markForCheck();
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    this._partnerDonePaginator.pageIndex = 0;
                    this.closeDetails();
                });
            merge(this._sort.sortChange, this._partnerDonePaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getPartnerDoneItems(this._partnerDonePaginator.pageIndex, this._partnerDonePaginator.pageSize, this._sort.active, this._sort.start);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }

        if (this._sort && this._partnerCancelPaginator) {
            this._sort.sort({
                id: 'StartDate',
                start: 'desc',
                disableClear: true
            });
            this._changeDetectorRef.markForCheck();
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    this._partnerCancelPaginator.pageIndex = 0;
                    this.closeDetails();
                });
            merge(this._sort.sortChange, this._partnerCancelPaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getPartnerCancelItems(this._partnerCancelPaginator.pageIndex, this._partnerCancelPaginator.pageSize, this._sort.active, this._sort.start);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }

        if (this._sort && this._ownerExpectedPaginator) {
            this._sort.sort({
                id: 'StartDate',
                start: 'desc',
                disableClear: true
            });
            this._changeDetectorRef.markForCheck();
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    this._ownerExpectedPaginator.pageIndex = 0;
                    this.closeDetails();
                });
            merge(this._sort.sortChange, this._ownerExpectedPaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getOwnerExpectedItems(this._ownerExpectedPaginator.pageIndex, this._ownerExpectedPaginator.pageSize, this._sort.active, this._sort.start);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }

        if (this._sort && this._ownerToDoPaginator) {
            this._sort.sort({
                id: 'StartDate',
                start: 'desc',
                disableClear: true
            });
            this._changeDetectorRef.markForCheck();
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    this._ownerToDoPaginator.pageIndex = 0;
                    this.closeDetails();
                });
            merge(this._sort.sortChange, this._ownerToDoPaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getOwnerToDoItems(this._ownerToDoPaginator.pageIndex, this._ownerToDoPaginator.pageSize, this._sort.active, this._sort.start);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }

        if (this._sort && this._ownerInProgressPaginator) {
            this._sort.sort({
                id: 'StartDate',
                start: 'desc',
                disableClear: true
            });
            this._changeDetectorRef.markForCheck();
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    this._ownerInProgressPaginator.pageIndex = 0;
                    this.closeDetails();
                });
            merge(this._sort.sortChange, this._ownerInProgressPaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getOwnerInProgressItems(this._ownerInProgressPaginator.pageIndex, this._ownerInProgressPaginator.pageSize, this._sort.active, this._sort.start);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }

        if (this._sort && this._ownerDonePaginator) {
            this._sort.sort({
                id: 'StartDate',
                start: 'desc',
                disableClear: true
            });
            this._changeDetectorRef.markForCheck();
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    this._ownerDonePaginator.pageIndex = 0;
                    this.closeDetails();
                });
            merge(this._sort.sortChange, this._ownerDonePaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getOwnerDoneItems(this._ownerDonePaginator.pageIndex, this._ownerDonePaginator.pageSize, this._sort.active, this._sort.start);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }

        if (this._sort && this._ownerCancelPaginator) {
            this._sort.sort({
                id: 'StartDate',
                start: 'desc',
                disableClear: true
            });
            this._changeDetectorRef.markForCheck();
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    this._ownerCancelPaginator.pageIndex = 0;
                    this.closeDetails();
                });
            merge(this._sort.sortChange, this._ownerCancelPaginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._service.getOwnerCancelItems(this._ownerCancelPaginator.pageIndex, this._ownerCancelPaginator.pageSize, this._sort.active, this._sort.start);
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

    onTabChange(event: MatTabChangeEvent): void {
        this.selectedTab = event.index;
    }

    onSubTabChange(event: MatTabChangeEvent): void {
        if(this.selectedTab === 0) {
            this.selectedPartnerSubTab = event.index;
        } else if(this.selectedTab === 1) {
            this.selectedOwnerSubTab = event.index;
        }
    }

    // toggleDetails(productId: string): void {
    //     // If the product is already selected...
    //     if (this.selectedCategory && this.selectedCategory.id === productId) {
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
    //             this.selectedCategory = item;
    //
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

    createItem(): void {
        // Create the product
        this._matDialog.open(TaskDetailsComponent, {
            autoFocus: false,
            data: {
                service: {}
            },
            width: '50vw',
        });
    }

    update(id: string, type: string): void {
        this._service.getItem(id, type)
            .subscribe((item) => {
                this.selectedCategory = item;

                this._matDialog.open(TaskDetailsComponent, {
                    autoFocus: false,
                    data: {
                        service: this.selectedCategory,
                        type: type
                    },
                    width: '70vw',
                    maxHeight: '90%'
                });
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    delete(id: string, type: string): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Xóa loại dịch vụ',
            message: 'Bạn có chắc chắn muốn xóa công việc này?!',
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
}
