import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {map, Subject, takeUntil} from 'rxjs';
import { Chat, Profile } from 'app/modules/admin/apps/chat/chat.types';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';
import {UserService} from "../../../../../core/user/user.service";
import {User} from "../../../../../core/user/user.types";
import {collection, collectionData, Firestore, limit, orderBy, query} from "@angular/fire/firestore";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FireStoreService} from "../firestore.service";

@Component({
    selector       : 'chat-chats',
    templateUrl    : './chats.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsComponent implements OnInit, OnDestroy
{
    chats: Chat[];
    drawerComponent: 'profile' | 'new-chat';
    drawerOpened: boolean = false;
    filteredChats: Chat[];
    profile: Profile;
    selectedChat: Chat;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private _userService: UserService,
        private _fireservice: FireStoreService,
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
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                console.log("user", user);
                this.user = user;
                this.getListChats(user.id);
            });
        // Chats
        this._chatService.chats$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chats: Chat[]) => {
                this.chats = this.filteredChats = chats;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Profile
        this._chatService.profile$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((profile: Profile) => {
                this.profile = profile;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Selected chat
        this._chatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.selectedChat = chat;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
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

    getListChats(id: string) {
        // this._fireservice.getCollectionStream(
        //     [['chats']]
        // ).pipe(map(data => console.log(data[0])))


        this._firestore
            .collection('chats')
            .get()
            .subscribe((querySnapshot) => {
                this.chats = [];

                querySnapshot.forEach((doc) => {
                    // @ts-ignore
                    const chatRoom = doc.data().chatRoom.filter(c => c.user1 === this.user.id || c.user2 === this.user.id);
                    const messages = chatRoom.messages;
                    console.log(doc)
                    const latestMessage = messages
                        .sort((a, b) => {
                            // @ts-ignore
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        })[0];

                    if (latestMessage) {
                        console.log(latestMessage)
                        this.chats.push({
                            id: chatRoom.id,
                            contactId: chatRoom.user1 === this.user.id ? chatRoom.user2 : chatRoom.user1,
                            lastMessage: latestMessage.content,
                            lastMessageAt: latestMessage.createdAt
                        })
                    }
                });
            });
    }

    /**
     * Filter the chats
     *
     * @param query
     */
    filterChats(query: string): void
    {
        // Reset the filter
        if ( !query )
        {
            this.filteredChats = this.chats;
            return;
        }

        this.filteredChats = this.chats.filter(chat => chat.contact.name.toLowerCase().includes(query.toLowerCase()));
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
