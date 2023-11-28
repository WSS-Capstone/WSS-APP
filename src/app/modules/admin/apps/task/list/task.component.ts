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
        `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class TaskListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('ownerPaginator') private _ownerPaginator: MatPaginator;
    @ViewChild('partnerPaginator') private _partnerPaginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    partnerItems$: Observable<Task[]>;
    ownerItems$: Observable<Task[]>;
    categories$: Observable<Category[]>;

    parentCategories$: Observable<Task[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    ownerPagination: TaskPagination;
    partnerPagination: TaskPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedCategory: Task | null = null;
    selectedCategoryForm: UntypedFormGroup;
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
        this._service.partnerPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: TaskPagination) => {

                // Update the pagination
                this.partnerPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._service.ownerPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: TaskPagination) => {

                // Update the pagination
                this.ownerPagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the products
        this.partnerItems$ = this._service.partnerItems$;
        this.ownerItems$ = this._service.ownerItems$;

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
                            return this._service.getPartnerItems(0, 10, 'status', 'asc', query);
                        case 1:
                            return this._service.getOwnerItems(0, 10, 'status', 'asc', query);
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
        if (this._sort && this._partnerPaginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'Code',
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

        if (this._sort && this._ownerPaginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'Code',
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
                    this._ownerPaginator.pageIndex = 1;

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
        this.selectedTab = event.index
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
        if(type === 'owner') {
            this._service.getOwnerItem(id)
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
        } else if(type === 'partner') {
            this._service.getPartnerItem(id)
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

                if(type === 'owner') {
                    // Delete the product on the server
                    this._service.delete(id, type).subscribe(() => {
                        this.openSnackBar('Xóa thành công', 'Đóng');
                        // Close the details
                        this.closeDetails();
                    });
                } else if(type === 'partner') {
                    // Delete the product on the server
                    this._service.delete(id, type).subscribe(() => {
                        this.openSnackBar('Xóa thành công', 'Đóng');
                        // Close the details
                        this.closeDetails();
                    });
                }
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
