import { Component, ViewEncapsulation } from '@angular/core';
import {NotificationsService} from "../../../../../layout/common/notifications/notifications.service";

@Component({
    selector     : 'forms-layouts',
    templateUrl  : './layouts.component.html',
    encapsulation: ViewEncapsulation.None
})
export class FormsLayoutsComponent
{
    /**
     * Constructor
     */
    constructor(
        private _notificationsService: NotificationsService,
    )
    {


    }
}
