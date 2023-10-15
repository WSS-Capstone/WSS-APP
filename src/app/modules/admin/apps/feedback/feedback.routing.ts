import {Route} from '@angular/router';
import {FeedbackComponent} from "./feedback.component";
import {FeedbackListComponent} from "./list/feedback-list.component";
import {CategoriesServiceResolver, FeedbackResolver, FeedbacksResolver} from "./feedback.resolvers";

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
                component: FeedbackListComponent,
                resolve  : {
                    // category    : CategoriesServiceResolver,
                    items: FeedbacksResolver,
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
