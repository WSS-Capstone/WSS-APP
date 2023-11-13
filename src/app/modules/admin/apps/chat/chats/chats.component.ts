import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {BehaviorSubject, map, Subject, takeUntil} from 'rxjs';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';
import {UserService} from "../../../../../core/user/user.service";
import {User} from "../../../../../core/user/user.types";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FireStoreService} from "../firestore.service";
import {combineLatest} from "rxjs";
import {Account} from "../../user/user.types";
import {Router} from "@angular/router";

export interface Chatt {
    uid: string;
    user1: string;
    user2: string;
    messages: Message[];
}

export interface Message {
    uid: string;
    contactId: string;
    content: string;
    createdAt: string;
}

export interface LatestMessage {
    id: string;
    userId: string;
    fullname: string;
    lastMessage: string;
    createdAt: string;
}

@Component({
    selector       : 'chat-chats',
    templateUrl    : './chats.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsComponent implements OnInit, OnDestroy
{
    // chats: Chat[];
    drawerComponent: 'profile' | 'new-chat';
    drawerOpened: boolean = false;
    filteredChats: LatestMessage[];
    // profile: Profile;
    // selectedChat: Chat;
    user: User;
    users: Account[];
    latestMessages$: BehaviorSubject<LatestMessage[]> = new BehaviorSubject<LatestMessage[]>([]);
    latest$ = this.latestMessages$.asObservable();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private _userService: UserService,
        private _firestore: AngularFirestore,
        private _changeDetectorRef: ChangeDetectorRef
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._chatService.items$.subscribe(data => {
            this.users = data;
            console.log("user", data);
        });

        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                console.log("user", user);
                this.user = user;
                this.getListChats(this.users);
                // // Mark for check
                this._changeDetectorRef.detectChanges();
                this.filterChats(null);
            });

        // Chats
        // this._chatService.chats$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((chats: Chat[]) => {
        //         this.chats = this.filteredChats = chats;
        //
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // Profile
        // this._chatService.profile$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((profile: Profile) => {
        //         this.profile = profile;
        //
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // Selected chat
        // this._chatService.chat$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((chat: Chat) => {
        //         this.selectedChat = chat;
        //
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getListChats(account: Account[]) {
        const query1= this._firestore.collection<Chatt>('chats',
                ref => ref.where('user1', '==', 'owner')).valueChanges({ idField: 'uid' });
        const query2= this._firestore.collection<Chatt>('chats',
            ref => ref.where('user2', '==', 'owner')).valueChanges({ idField: 'uid' });

        combineLatest([query1, query2]).subscribe(data => {
            const ccc = [...data[0], ...data[1]];

            const obsevables = ccc.map(c => {
                return this._firestore.collection<any>(`chats/${c.uid}/messages`,
                    ref => ref.orderBy('createdAt', "desc").limit(1)).valueChanges({ idField: 'uid' })
                    .pipe(map(value => value.map(x => ({...x, uid: c.uid, uerId: c.user1 === 'owner' ? c.user2 : c.user1}))));
            })

            combineLatest(obsevables).subscribe(value => {
                let latestMessages: LatestMessage[] = [];
                // console.log(value)

                value.flatMap(x => {
                    const index= account.findIndex(xx => xx.id == x[0]?.uerId);
                    latestMessages.push({
                        id: x[0].uid,
                        userId: x[0]?.uerId,
                        fullname: account[index]?.user?.fullname,
                        createdAt: x[0]?.createdAt,
                        lastMessage: x[0]?.content
                    })
                })

                latestMessages = latestMessages
                    .sort((a, b) => {
                        return new Date(b.createdAt) > new Date(a.createdAt) ? 1 : -1
                    })
                console.log(latestMessages)
                this.latestMessages$.next(latestMessages);
            })
        });
    }

    /**
     * Filter the chats
     *
     * @param query
     */
    filterChats(query: string): void
    {
        //Reset the filter
        if ( !query )
        {
            this.latest$.subscribe(x => this.filteredChats = x);
            return;
        }

        this.latest$.subscribe(x => {
            this.filteredChats = x.filter(c => c.fullname.toLowerCase().includes(query.toLowerCase()));
        });
    }

    /**
     * Open the new chat sidebar
     */
    openNewChat(): void
    {
        this.drawerComponent = 'new-chat';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Open the profile sidebar
     */
    openProfile(): void
    {
        this.drawerComponent = 'profile';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
