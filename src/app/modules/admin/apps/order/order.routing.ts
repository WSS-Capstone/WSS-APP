import {Route} from '@angular/router';
import {OrderListComponent} from "./list/order.component";
import {WeddingsServiceResolver, OrderResolver, OrdersResolver} from "./order.resolvers";
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
                    items: OrdersResolver,
                }
            },
            {
                path         : ':id',
                component    : OrderDetailsComponent,
                resolve      : {
                    items    : OrdersResolver,
                    item     : OrderResolver
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
