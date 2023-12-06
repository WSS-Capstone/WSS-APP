import {Route} from '@angular/router';
import {TaskComponent} from "./task.component";
import {TaskListComponent} from "./list/task.component";
import { OrderUsersResolver } from '../order/order.resolvers';
import {
    OwnerCancelTasksResolver,
    OwnerDoneTasksResolver,
    OwnerExpectedTasksResolver,
    OwnerInProgressTasksResolver,
    OwnerToDoTasksResolver,
    PartnerCancelTasksResolver,
    PartnerDoneTasksResolver,
    PartnerExpectedTasksResolver,
    PartnerInProgressTasksResolver,
    PartnerToDoTasksResolver
} from "./task.resolvers";

export const itemRoutes: Route[] = [
    // {
    //     path      : '',
    //     pathMatch : 'full',
    //     redirectTo: 'discount'
    // },
    // {
    //     path     : 'discount',
    //     component: DiscountComponent,
    //     children : [
            {
                path     : '',
                component: TaskListComponent,
                resolve  : {
                    // category    : CategoriesServiceResolver,
                    ownerExpectedItems: OwnerExpectedTasksResolver,
                    ownerToDoItems: OwnerToDoTasksResolver,
                    ownerInProgressItems: OwnerInProgressTasksResolver,
                    ownerDoneItems: OwnerDoneTasksResolver,
                    ownerCancelItems: OwnerCancelTasksResolver,
                    partnerExpectedItems: PartnerExpectedTasksResolver,
                    partnerToDoItems: PartnerToDoTasksResolver,
                    partnerInProgressItems: PartnerInProgressTasksResolver,
                    partnerDoneItems: PartnerDoneTasksResolver,
                    partnerCancelItems: PartnerCancelTasksResolver,
                    users    : OrderUsersResolver
                    // category  : CategoryResolver,
                }
            }
        // ]
        /*children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]*/
    // }
];
