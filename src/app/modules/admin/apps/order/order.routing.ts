import {Route} from '@angular/router';
import {OrderListComponent} from "./list/order.component";
import {
    CancelledOrdersResolver,
    DoingOrdersResolver,
    DoneOrdersResolver,
    OrderResolver,
    OrderUsersResolver,
    PendingOrdersResolver
} from "./order.resolvers";
import { OrderDetailsComponent } from './detail/details.component';
import {DiscountsResolver} from "../discount/discount.resolvers";

export const itemRoutes: Route[] = [
    // {
    //     path      : '',
    //     pathMatch : 'full',
    //     redirectTo: 'order'
    // },
    // {
        // path     : 'order',
        // component: OrderComponent,
        // children : [
            {
                path     : '',
                component: OrderListComponent,
                resolve  : {
                    // items: OrdersResolver,
                    pendingItems: PendingOrdersResolver,
                    doingItems: DoingOrdersResolver,
                    doneItems: DoneOrdersResolver,
                    cancelledItems: CancelledOrdersResolver,
                }
            },
            {
                path         : ':id',
                component    : OrderDetailsComponent,
                resolve      : {
                    // items    : OrdersResolver,
                    item     : OrderResolver,
                    users    : OrderUsersResolver
                },
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
