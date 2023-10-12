import {Route} from '@angular/router';
import {OrderComponent} from "./order.component";
import {OrderListComponent} from "./list/order.component";
import {CategoriesServiceResolver, OrderResolver, OrdersResolver} from "./order.resolvers";
import { OrderDetailsComponent } from './detail/details.component';

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
                    category : CategoriesServiceResolver,
                    items: OrdersResolver,
                }
            },
            {
                path         : ':id',
                component    : OrderDetailsComponent,
                resolve      : {
                    item     : OrderResolver,
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
