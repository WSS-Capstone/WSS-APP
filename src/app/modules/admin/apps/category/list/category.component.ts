import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
    catchError,
    debounceTime,
    map,
    merge,
    Observable,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Category, CategoryPagination } from '../category.types';
import { CategoryService } from '../category.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDetailsComponent } from '../detail/details.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'category-list',
    templateUrl: './category.component.html',
    styles: [
        /* language=SCSS */
        `
            .category-grid {
                grid-template-columns: 50px auto 40px;

                @screen sm {
                    grid-template-columns: 50px auto 165px 72px;
                }

                @screen md {
                    grid-template-columns: 50px auto 159px 79px;
                }

                @screen lg {
                    grid-template-columns: 50px 141px auto 159px 79px;
                }
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class CategoryListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    categories$: Observable<Category[]>;

    parentCategories$: Observable<Category[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: CategoryPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedCategory: Category | null = null;
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
        private sanitizer: DomSanitizer,
        private _snackBar: MatSnackBar,
        private _matDialog: MatDialog,
        private _categoryService: CategoryService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    sanitizeImageUrl(imageUrl: string): any {
        return this.sanitizer.bypassSecurityTrustUrl('http://' + imageUrl);
    }
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
        this._categoryService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: CategoryPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the products
        this.categories$ = this._categoryService.categories$;
        this.parentCategories$ = this._categoryService.parentCategories$;

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._categoryService.getCategories(
                        0,
                        10,
                        'name',
                        'asc',
                        query
                    );
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
                disableClear: true,
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
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.closeDetails();
                        this.isLoading = true;
                        return this._categoryService.getCategories(
                            this._paginator.pageIndex,
                            this._paginator.pageSize,
                            this._sort.active,
                            this._sort.direction
                        );
                    }),
                    map(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe();
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
        this._categoryService
            .getCategoryById(productId)
            .subscribe((product) => {
                // Set the selected product
                this.selectedCategory = product;

                // Fill the form
                this.selectedCategoryForm.patchValue(product);
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

    /**
     * Cycle through images of selected product
     */
    cycleImages(forward: boolean = true): void {
        // Get the image count and current image index
        const count = this.selectedCategoryForm.get('images').value.length;
        const currentIndex =
            this.selectedCategoryForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if (forward) {
            this.selectedCategoryForm
                .get('currentImageIndex')
                .setValue(nextIndex);
        }
        // If cycling backwards...
        else {
            this.selectedCategoryForm
                .get('currentImageIndex')
                .setValue(prevIndex);
        }
    }

    /**
     * Create product
     */
    createCategory(): void {
        // Create the product
        this._matDialog.open(CategoryDetailsComponent, {
            autoFocus: false,
            data: {
                category: {},
            },
            width: '40vw',
        });

        // this._categoryService.createCategory().subscribe((newProduct) => {
        //
        //     // Go to new product
        //     this.selectedCategory = newProduct;
        //
        //     // Fill the form
        //     this.selectedCategoryForm.patchValue(newProduct);
        //
        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // });
    }

    /**
     * Update the selected product using the form data
     */
    update(id: string): void {
        this._categoryService.getCategoryById(id).subscribe((cate) => {
            // Set the selected cate
            this.selectedCategory = cate;

            this._matDialog.open(CategoryDetailsComponent, {
                autoFocus: false,
                data: {
                    category: this.selectedCategory,
                },
                width: '40vw',
            });
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // const cate = this.selectedCategoryForm.getRawValue();
        // delete cate.currentImageIndex;
        // delete cate.images;
        // // delete cate.id;
        // console.log(cate);
        // this._categoryService.updateCategory(cate.id, cate)
        //     .pipe(
        //         catchError((error) => {
        //             // Log the error
        //             console.error(error);
        //
        //             // Show a success message
        //             this.showFlashMessage('error');
        //
        //             // Return
        //             return [];
        //         })
        //     )
        //     .subscribe(() => {
        //         // this.selectedCategoryForm.reset();
        //         // Show a success message
        //         this.showFlashMessage('success');
        //     });
    }

    /**
     * Delete the selected product using the form data
     */
    delete(id: string): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Xóa loại dịch vụ',
            message: 'Bạn có chắc chắn muốn xóa loại dịch vụ này?!',
            actions: {
                confirm: {
                    label: 'Xóa',
                },
                cancel: {
                    label: 'Hủy',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                console.log(id);
                // Delete the product on the server
                this._categoryService.deleteCategory(id).subscribe(() => {
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
