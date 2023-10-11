import {Route} from '@angular/router';
import {ServiceApprovalComponent} from "./service-approval.component";
import {ServiceApprovalListComponent} from "./list/service-approval-list.component";
import {CategoriesServiceResolver, ApproveServicesResolver} from "./service-approval.resolvers";

export const itemRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'approve-service'
    },
    {
        path     : 'approve-service',
        component: ServiceApprovalComponent,
        children : [
            {
                path     : '',
                component: ServiceApprovalListComponent,
                resolve  : {
                    // category    : CategoriesServiceResolver,
                    // items: CombosResolver,
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
