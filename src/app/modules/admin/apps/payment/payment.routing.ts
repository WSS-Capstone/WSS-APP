import {Route} from '@angular/router';
import {PaymentListComponent} from "./list/payment-list.component";
import {CategoriesServiceResolver, PaymentResolver, PaymentsResolver} from "./payment.resolvers";

export const itemRoutes: Route[] = [
    // {
    //     path      : '',
    //     pathMatch : 'full',
    //     redirectTo: 'approve-service'
    // },
    // {
    //     path     : 'approve-service',
    //     component: FeedbackComponent,
    //     children : [
            {
                path     : '',
                component: PaymentListComponent,
                resolve  : {
                    // category    : CategoriesServiceResolver,
                    items: PaymentsResolver,
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
