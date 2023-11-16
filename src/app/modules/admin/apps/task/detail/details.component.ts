import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {map, Observable, of, Subject} from 'rxjs';
import {Label} from 'app/modules/admin/apps/notes/notes.types';
import {Comment, Task} from "../task.types";
import {TaskService} from "../task.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {Category} from "../../category/category.types";
import { formatDate } from '@angular/common';
import { OrderService } from '../../order/order.service';
import { Account } from '../../user/user.types';
import {MatSelectChange} from "@angular/material/select";

@Component({
    selector: 'Task-details',
    templateUrl: './details.component.html',
    styles: [`
          .fix-height {
              height: 70vh !important;
          }
    `],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class TaskDetailsComponent implements OnInit, OnDestroy {
    flashMessage: 'success' | 'error' | null = null;
    labels$: Observable<Label[]>;
    itemChanged: Subject<Task> = new Subject<Task>();
    item$: Observable<Task>;
    comments: Comment[];
    users: Account[];
    categories$: Observable<Category[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    imgDataOrLink: any;
    form: FormGroup;
    commentInput = new FormControl('', [Validators.required, Validators.maxLength(300)]);

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public _data: { service: Task, type: string },
        private _service: TaskService,
        private _orderService: OrderService,
        private _matDialogRef: MatDialogRef<TaskDetailsComponent>
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
                this.item$ = this._service.ownerItem$;
            } else if(this._data.type === 'partner') {
                this._service.getPartnerItem(this._data.service.id).subscribe();
                this.item$ = this._service.partnerItem$;
            }

            this.item$.subscribe((value) => {
                this._patchValue(value);
                this._orderService.users$.subscribe(userss => {
                    this.users = userss.filter(x => value.staff ? x.roleName === 'Staff' : x.roleName === 'Partner');
                    this._changeDetectorRef.markForCheck();
                });
            });
        }
    }

    private _initForm(): void {
        this.form = this._fb.group({
            id: [null],
            code: [null],
            startTime: [null],
            endTime: [null],
            taskName: [null],
            status: [null],
            staffId: [null],
            staffName: [null],
            partnerName: [null],
            partnerIde: [null],
            orderName: [null],
            serviceName: [null],
        });
    }

    private _patchValue(value: Task) {
        this.form.patchValue({
            id: value.id,
            code: value.code,
            startTime: new Date(value.orderDetails[0]?.startTime),
            endTime: new Date(value.orderDetails[0]?.endTime),
            taskName: value.taskName,
            status: value.status,
            staffId: null,
            staffName: value.staff?.fullname,
            partnerId: null,
            partnerName: value.partner?.fullname,
            orderName: 'Đơn hàng của ' + value.orderDetails[0]?.order?.fullname,
            serviceName: value.orderDetails[0]?.service?.name,
        });

        this.comments = value.comments.sort((a:Comment, b:Comment) => {return a.createDate > b.createDate ? 1 : -1});
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

    addComment() {
        if(this.commentInput.value.length === 0) {
            return;
        }

        this._service.addComment(this._data.service.id, this.commentInput.value, this._data.type).pipe(
            map(() => {
                this.commentInput.reset();
            })
        ).subscribe();
    }

    onSelectChange(event: MatSelectChange) {
        console.log(event)
        const requestBody = {
            status: event.value,
        }

        this._service.updateStatus(this.form.get('id').value, requestBody, this._data.type).pipe(
            map(() => {
                this.showFlashMessage('success');
            })).subscribe();
    }

    filterStart = (date: Date | null): boolean => {
        const endDate = this.form.get('endTime').value;

        return (
          !endDate || date <= endDate
        );
    }

    filterEnd = (date: Date | null): boolean => {
        const startDate = this.form.get('startTime').value;

        return (
            !startDate || date >= startDate
        );
    }

    create(): void {
        // this._service.create(this.form.value).pipe(
        //     map(() => {
        //         // Get the note
        //         // this.cate$ = this._categoryService.category$;
        //         this.showFlashMessage('success');
        //     })).subscribe();
        //
        // setTimeout(() => {
        //     this._matDialogRef.close();
        // }, 3100);
    }

    update(): void {
        console.log(this.form.value)
        // this._service.update(this.form.get('id').value ,this.form.value).pipe(
        //     map(() => {
        //         // Get the note
        //         // this.cate$ = this._categoryService.category$;
        //         this.showFlashMessage('success');
        //     })).subscribe();
        //
        // setTimeout(() => {
        //     this._matDialogRef.close();
        // }, 1200);
    }

    /**
     * Upload image to given note
     *
     * @param cate
     * @param fileList
     */
    uploadImage(event: any): void {
        if (!event.target.files[0]) {
            return;
        }

        const file = event.target.files[0];
        // send request upload file

        this._service.uploadImage(file).subscribe((res) => {
            this.imgDataOrLink = res;
            this.form.patchValue({
                imageUrl: this.imgDataOrLink,
            });
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
        //     cate.imageUrl = data;
        //
        //     // Update the note
        //     this.itemChanged.next(cate);
        // });
    }

    /**
     * Remove the image on the given note
     *
     * @param note
     */
    // removeImage(cate: Task): void {
    //     cate.imageUrl = null;
    //
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
}
