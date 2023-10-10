import {Route} from '@angular/router';
import {OrderComponent} from "./order.component";
import {OrderListComponent} from "./list/order.component";
import {CategoriesServiceResolver, OrdersResolver} from "./order.resolvers";

export const itemRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'combo'
    },
    {
        path     : 'combo',
        component: OrderComponent,
        children : [
            {
                path     : '',
                component: OrderListComponent,
                resolve  : {
                    category    : CategoriesServiceResolver,
                    items: OrdersResolver,
                    // category  : CategoryResolver,
                }
            }
        ]
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
    }
];
