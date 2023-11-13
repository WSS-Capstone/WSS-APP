import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import {Account} from "../../user/user.types";

@Component({
    selector       : 'chat-contact-info',
    templateUrl    : './contact-info.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactInfoComponent
{
    @Input() account: Account;
    @Input() drawer: MatDrawer;

    /**
     * Constructor
     */
    constructor()
    {
    }
}
