import {Route} from '@angular/router';
import {ComboComponent} from "./combo.component";
import {ComboListComponent} from "./list/combo.component";
import {CategoriesServiceResolver, ComboResolver, CombosResolver, ServicesServiceResolver} from "./combo.resolvers";
import {ComboDetailsComponent} from "./detail/details.component";
import {ComboDetailComponent} from "./combo-detail/details.component";
import { CategoriesResolver, CategoryResolver } from '../category/category.resolvers';

export const itemRoutes: Route[] = [
    // {
    //     path      : '',
    //     pathMatch : 'full',
    //     redirectTo: 'combo'
    // },
    // {
        // path     : 'combo',
        // component: ComboComponent,
        // children : [
            {
                path     : '',
                component: ComboListComponent,
                resolve  : {
                    category    : CategoriesServiceResolver,
                    items: CombosResolver,

                }
            },
            {
                path     : 'create',
                component: ComboDetailComponent,
                pathMatch: 'full',
                resolve  : {
                    services: ServicesServiceResolver,
                    category    : CategoriesServiceResolver,
                }
            },
            {
                path     : ':id',
                component: ComboDetailComponent,
                resolve  : {
                    // items: CombosResolver,
                    item: ComboResolver,
                    services: ServicesServiceResolver,
                }
            },

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
