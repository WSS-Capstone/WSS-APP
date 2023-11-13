import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {BehaviorSubject, map, Observable, of, Subject, switchMap, take, throwError} from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Chat } from 'app/modules/admin/apps/chat/chat.types';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';
import {ActivatedRoute} from "@angular/router";
import {Message} from "../chats/chats.component";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Account} from "../../user/user.types";
import {FormControl} from "@angular/forms";
import {DateTime} from "luxon";

@Component({
    selector       : 'chat-conversation',
    templateUrl    : './conversation.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationComponent implements OnInit, OnDestroy
{
    @ViewChild('messageInput') messageInput: ElementRef;
    chat: Chat;
    messages$: BehaviorSubject<Message[]> = new BehaviorSubject([]);
    messagesObs$ = this.messages$.asObservable();
    account$: Observable<Account>;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    messageTextInput = new FormControl('');
    chatId: string;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _chatService: ChatService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _ngZone: NgZone,
        private _firestore: AngularFirestore,
        private _route: ActivatedRoute
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Decorated methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resize on 'input' and 'ngModelChange' events
     *
     * @private
     */
    @HostListener('input')
    @HostListener('ngModelChange')
    private _resizeMessageInput(): void
    {
        // This doesn't need to trigger Angular's change detection by itself
        this._ngZone.runOutsideAngular(() => {

            setTimeout(() => {

                // Set the height to 'auto' so we can correctly read the scrollHeight
                this.messageInput.nativeElement.style.height = 'auto';

                // Detect the changes so the height is applied
                this._changeDetectorRef.detectChanges();

                // Get the scrollHeight and subtract the vertical padding
                this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;

                // Detect the changes one more time to apply the final height
                this._changeDetectorRef.detectChanges();
            });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._route.paramMap.subscribe(param => {
            // const id = param.get("id");
            this.chatId = param.get("id");
            this.account$ = this._chatService.items$
                .pipe(
                    take(1),
                    map(accs => {
                        return accs.find(item => item.id === this._chatService._selectUser)
                    }),
                    switchMap((acc) => {
                        if (!acc) {
                            return throwError('Could not found account with id of ' + this.chatId + '!');
                        }
                        return of(acc);
                    })
                );

            console.log('conversation', this.chatId, this._chatService._selectUser)

            const mess = this._firestore.collection<any>(`chats/${this.chatId}/messages`,
                ref => ref.orderBy('createdAt', "asc")).valueChanges({ idField: 'uid' })

            mess.subscribe(data =>
            {
                const messages: Message[] = [];
                data.map(x => {
                    // if(messages.findIndex(xx => xx.uid === x.uid) < 0) {
                        messages.push({
                            uid: x.uid,
                            content: x?.content,
                            contactId: x?.contactId,
                            createdAt: x?.createdAt
                        })
                    // }
                })

                this.messages$.next(messages);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            })
        })

        // Chat
        // this._chatService.chat$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((chat: Chat) => {
        //         this.chat = chat;
        //
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // Subscribe to media changes
        // this._fuseMediaWatcherService.onMediaChange$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(({matchingAliases}) => {
        //
        //         // Set the drawerMode if the given breakpoint is active
        //         if ( matchingAliases.includes('lg') )
        //         {
        //             this.drawerMode = 'side';
        //         }
        //         else
        //         {
        //             this.drawerMode = 'over';
        //         }
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

    sendMessage(toUserId: string) {
        if(this.messageTextInput.value.length > 0) {
            const m = {
                contactId: 'owner',
                content: this.messageTextInput.value,
                createdAt: DateTime.now().toString()
            }

            this._firestore.collection<any>(`chats/${this.chatId}/messages`).add(m).then(
                () => {
                 this.messageTextInput.reset();
                }
            )
        }
    }

    /**
     * Open the contact info
     */
    openContactInfo(): void
    {
        // Open the drawer
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Reset the chat
     */
    resetChat(): void
    {
        this._chatService.resetChat();

        // Close the contact info in case it's opened
        this.drawerOpened = false;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle mute notifications
     */
    toggleMuteNotifications(): void
    {
        // Toggle the muted
        this.chat.muted = !this.chat.muted;

        // Update the chat on the server
        this._chatService.updateChat(this.chat.id, this.chat).subscribe();
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
