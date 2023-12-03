import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfirmationConfig } from '@fuse/services/confirmation/confirmation.types';
import {FormControl, Validators} from "@angular/forms";

@Component({
    selector     : 'fuse-confirmation-dialog',
    templateUrl  : './dialog.component.html',
    styles       : [
        `
            .fuse-confirmation-dialog-panel {

                @screen md {
                    @apply w-128;
                }

                .mat-mdc-dialog-container {

                    .mat-mdc-dialog-surface {
                        padding: 0 !important;
                    }
                }
            }
        `
    ],
    encapsulation: ViewEncapsulation.None
})
export class FuseConfirmationDialogComponent
{
    commentInput = new FormControl('', [Validators.required, Validators.maxLength(300)]);

    /**
     * Constructor
     */
    constructor(@Inject(MAT_DIALOG_DATA) public data: FuseConfirmationConfig)
    {
    }



}
