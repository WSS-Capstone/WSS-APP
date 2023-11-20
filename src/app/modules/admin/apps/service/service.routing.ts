import {Route} from '@angular/router';
import {ServiceComponent} from "./service.component";
import {ServiceListComponent} from "./list/service.component";
import {
    CategoriesServiceResolver,
    OwnerServicesResolver,
    PartnerServicesResolver,
    PendingServicesResolver
} from "./service.resolvers";
import {OrderUsersResolver} from "../order/order.resolvers";

export const itemRoutes: Route[] = [
    // {
    //     path      : '',
    //     pathMatch : 'full',
    //     redirectTo: 'service'
    // },
    // {
    //     path     : 'service',
    //     component: ServiceComponent,
    //     children : [
            {
                path     : '',
                component: ServiceListComponent,
                resolve  : {
                    category    : CategoriesServiceResolver,
                    ownerItems: OwnerServicesResolver,
                    partnerItems: PartnerServicesResolver,
                    PendingItems: PendingServicesResolver,
                    users: OrderUsersResolver,
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
