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
import {map, Observable, of, startWith, Subject, tap} from 'rxjs';
import {Label} from 'app/modules/admin/apps/notes/notes.types';
import {Comment, Task} from "../task.types";
import {TaskService} from "../task.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {Category} from "../../category/category.types";
import {formatDate} from '@angular/common';
import {OrderService} from '../../order/order.service';
import {Account} from '../../user/user.types';
import {MatSelectChange} from "@angular/material/select";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {environment} from "../../../../../../environments/environment";
import {DomSanitizer} from "@angular/platform-browser";

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
    filteredOptions: Observable<Account[]>;
    tempUserId: string;
    tempUserName: string;
    tempUser: Account;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public _data: { service: Task, type: string },
        private _service: TaskService,
        private _orderService: OrderService,
        private sanitizer: DomSanitizer,
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

            this._service.getItem(this._data.service.id, this._data.type).subscribe();
            this.item$ = this._service.selectedItem$;

            this.item$.subscribe((value) => {
                console.log(value.imageEvidence)
                if (value.imageEvidence) {
                    this.imgDataOrLink = this.mapImageUrl(value.imageEvidence);
                    this._changeDetectorRef.detectChanges();
                }
                this._patchValue(value);
                this._orderService.users$.subscribe(userss => {
                    this.users = userss.filter(x => value.partner ? x.roleName === 'Partner' : x.roleName === 'Staff');
                    this.tempUser = this.users.find(x => x.id === value.staff.id);
                    this._changeDetectorRef.markForCheck();
                });
            });
        }
    }

    mapImageUrl(imageUrl: string): any {
        var imageRelativeUrl = imageUrl.substring(imageUrl.indexOf('/upload/'));
        var apiUrl = environment.wssApi;
        return this.sanitizer.bypassSecurityTrustUrl(apiUrl + imageRelativeUrl);
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
            address: [null],
            note: [null],
            partnerId: [null],
            orderName: [null],
            serviceName: [null],
        });
    }

    private _patchValue(value: Task) {
        console.log(value);
        this.form.patchValue({
            id: value.id,
            code: value.code,
            startTime: new Date(value.orderDetail.startTime),
            endTime: new Date(value.orderDetail?.endTime),
            taskName: value.taskName,
            status: value.status,
            staffId: value.staff?.id,
            staffName: value.staff?.fullname,
            partnerId: value.partner?.id,
            address: value.orderDetail?.address,
            note: value.orderDetail?.description,
            partnerName: value.partner?.fullname,
            orderName: 'Đơn hàng của ' + value.orderDetail?.order?.fullname,
            serviceName: value.orderDetail?.service?.name,
        });

        this.comments = value.comments.sort((a: Comment, b: Comment) => {
            return a.createDate > b.createDate ? 1 : -1
        });

        // this.tempUserId = this.form.get('staffId')?.value;
        // this.tempUserName = this.form.get('staffName')?.value || '';
        //
        // this.filteredOptions = this.form.get('staffId').valueChanges.pipe(
        //     startWith(''),
        //     map(value => {
        //         const name = typeof value === 'string' ? value : value?.name;
        //         return name ? this._filter(name as string) : this.users.slice();
        //     })
        // );
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
        if (this.commentInput.value.length === 0) {
            return;
        }

        this._service.addComment(this._data.service.id, this.commentInput.value, this._data.type).pipe(
            map(() => {
                this.commentInput.reset();
            })
        ).subscribe();
    }

    onSelectChangeStaff(event: MatSelectChange) {
        // this.tempUserId = event.option.value.id;
        // this.tempUserName = event.option.value.user?.fullname  || '';
        // console.log(this.tempUserId, this.tempUserName, event)
        console.log(event)
        this.form.patchValue({
            staffId: event.value
        })
    }

    onSelectChange(event: MatSelectChange) {
        console.log(event)
        this.form.patchValue({
            status: event.value
        })

        // const requestBody = {
        //     status: event.value,
        // }
        //
        // this._service.updateStatus(this.form.get('id').value, requestBody, this._data.type).pipe(
        //     map(() => {
        //         this.showFlashMessage('success');
        //     })).subscribe();
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
        let stt = 0;

        switch (this.form.get('status').value) {
            case 'EXPECTED':
                stt = 0
                break;
            case 'TO_DO':
                stt = 1
                break;
            case 'IN_PROGRESS':
                stt = 2
                break;
            case 'DONE':
                stt = 3
                break;
        }

        const request = {
            id: this.form.get('id').value,
            userId: this.form.get('staffId').value,
            status: stt
        }

        if (this._data.type.includes('owner')) {
            let curStt = 0;
            switch (this._data.type) {
                case 'owner_expected':
                    curStt = 0
                    break;
                case 'owner__to_do':
                    curStt = 1
                    break;
                case 'owner__in_progress':
                    curStt = 2
                    break;
                case 'owner_done':
                    curStt = 3
                    break;
            }

            this._service.updateTask(this.form.get('id').value, request, curStt, stt).pipe(
                map(() => {
                    // Get the note
                    // this.cate$ = this._categoryService.category$;
                    this.showFlashMessage('success');
                })).subscribe();
        } else {
            let curStt = 0;
            switch (this._data.type) {
                case 'partner_expected':
                    curStt = 0
                    break;
                case 'partner__to_do':
                    curStt = 1
                    break;
                case 'partner__in_progress':
                    curStt = 2
                    break;
                case 'partner_done':
                    curStt = 3
                    break;
            }
            this._service.updateTaskPartner(this.form.get('id').value, request, curStt, stt).pipe(
                map(() => {
                    // Get the note
                    // this.cate$ = this._categoryService.category$;
                    this.showFlashMessage('success');
                })).subscribe();
        }

        // this._service.updateTask(this.form.get('id').value, request).pipe(
        //     map(() => {
        //         // Get the note
        //         // this.cate$ = this._categoryService.category$;
        //         this.showFlashMessage('success');
        //     })).subscribe();

        setTimeout(() => {
            this._matDialogRef.close();
        }, 1200);
    }

    private _filter(name: string): Account[] {
        const filterValue = name.toLowerCase();

        return this.users.filter(option => option.user?.fullname.toLowerCase().includes(filterValue));
    }

    displayFn(user: Account): string {
        return user && user.user?.fullname ? user.user?.fullname : '';
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
