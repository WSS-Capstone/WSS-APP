import {Route} from '@angular/router';
import {CategoryComponent} from "./category.component";
import {CategoryListComponent} from "./list/category.component";
import {CategoriesResolver, CategoryResolver, ParentCategoriesResolver} from "./category.resolvers";

export const categoryRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'category'
    },
    {
        path     : 'category',
        component: CategoryComponent,
        children : [
            {
                path     : '',
                component: CategoryListComponent,
                resolve  : {
                    parentCategory    : ParentCategoriesResolver,
                    categories: CategoriesResolver,
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
