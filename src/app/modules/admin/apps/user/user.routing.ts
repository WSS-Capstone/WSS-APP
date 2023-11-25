import {Route} from '@angular/router';
import {UserComponent} from "./user.component";
import {UserListComponent} from "./list/user.component";
import {
    CategoriesResolver, CustomerUsersResolver,
    OwnerUsersResolver,
    PartnerUsersResolver,
    StaffUsersResolver,
} from "./user.resolvers";
import {User} from "./user.types";

export const itemRoutes: Route[] = [
    // {
    //     path      : '',
    //     pathMatch : 'full',
    //     redirectTo: 'discount'
    // },
    // {
    //     path     : 'discount',
    //     component: DiscountComponent,
    //     children : [
            {
                path     : '',
                component: UserListComponent,
                resolve  : {
                    // category    : CategoriesServiceResolver,
                    ownerItems: OwnerUsersResolver,
                    partnerItems: PartnerUsersResolver,
                    staffItems: StaffUsersResolver,
                    customerItems: CustomerUsersResolver,
                    category  : CategoriesResolver,
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
