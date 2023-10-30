import {Route} from '@angular/router';
import {ComboComponent} from "./combo.component";
import {ComboListComponent} from "./list/combo.component";
import {CategoriesServiceResolver, ComboResolver, CombosResolver} from "./combo.resolvers";
import {ComboDetailsComponent} from "./detail/details.component";
import {ComboDetailComponent} from "./combo-detail/details.component";

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
                    // category  : CategoryResolver,
                }
            },
            {
                path     : ':id',
                component: ComboDetailComponent,
                resolve  : {
                    items: CombosResolver,
                    item: ComboResolver
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
