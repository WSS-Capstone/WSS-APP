import {Route} from '@angular/router';
import {DiscountComponent} from "./discount.component";
import {DiscountListComponent} from "./list/discount.component";
import {CategoriesServiceResolver, CombosResolver} from "./discount.resolvers";

export const itemRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'discount'
    },
    {
        path     : 'discount',
        component: DiscountComponent,
        children : [
            {
                path     : '',
                component: DiscountListComponent,
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
