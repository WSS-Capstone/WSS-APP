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

@Component({
    selector: 'task-list',
    templateUrl: './task.component.html',
    styles: [
        /* language=SCSS */
        `
            .task-grid {
                grid-template-columns: 56px auto 180px 130px 130px 130px 130px 130px 130px;

                //@screen sm {
                //    grid-template-columns: 150px 150px 150px 150px 180px 180px 150px 150px;
                //}
                //
                //@screen md {
                //    grid-template-columns: 150px 150px 150px 150px 180px 180px 150px 150px;
                //}
                //
                //@screen lg {
                //  grid-template-columns:
                //}

            }

            .vh-70 {
                height: 70vh !important;
            }
        `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class TaskListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    partnerItems$: Observable<Task[]>;
    staffItems$: Observable<Task[]>;
    categories$: Observable<Category[]>;

    parentCategories$: Observable<Task[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: TaskPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedCategory: Task | null = null;
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
            .subscribe((pagination: TaskPagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the products
        this.partnerItems$ = this._service.items$.pipe(map(value => value.filter(x => x.partner)));
        this.staffItems$ = this._service.items$.pipe(map(value => value.filter(x => x.staff)));

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

    toggleDetails(productId: string): void {
        // If the product is already selected...
        if (this.selectedCategory && this.selectedCategory.id === productId) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the product by id
        this._service.getItem(productId)
            .subscribe((item) => {

                // Set the selected item
                this.selectedCategory = item;

                // Fill the form
                this.selectedCategoryForm.patchValue(item);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

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

    update(id: string): void {
        this._service.getItem(id)
            .subscribe((item) => {
                this.selectedCategory = item;

                this._matDialog.open(TaskDetailsComponent, {
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
