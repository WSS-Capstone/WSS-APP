import {Route} from '@angular/router';
import {TaskComponent} from "./task.component";
import {TaskListComponent} from "./list/task.component";
import { OrderUsersResolver } from '../order/order.resolvers';
import {OwnerTasksResolver, PartnerTasksResolver} from "./task.resolvers";

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
                    ownerItems: OwnerTasksResolver,
                    partnerItems: PartnerTasksResolver,
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
