import {Route} from '@angular/router';
import {ComboComponent} from "./combo.component";
import {ComboListComponent} from "./list/combo.component";
import {CategoriesServiceResolver, CombosResolver} from "./combo.resolvers";

export const itemRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'combo'
    },
    {
        path     : 'combo',
        component: ComboComponent,
        children : [
            {
                path     : '',
                component: ComboListComponent,
                resolve  : {
                    category    : CategoriesServiceResolver,
                    items: CombosResolver,
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
