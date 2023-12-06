import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, of, ReplaySubject, switchMap, take, tap} from 'rxjs';
import {Notification, NotificationResonponse} from 'app/layout/common/notifications/notifications.types';
import {ENDPOINTS} from "../../../core/global.constants";
import {UserService} from "../../../core/user/user.service";
import {notifications} from "../../../mock-api/common/notifications/data";

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    private _notifications: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);
    private userId?: string;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private _user: UserService) {
        this._user.user$.subscribe(user => {
            this.userId = user.id;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for notifications
     */
    get notifications$(): Observable<Notification[]> {
        return this._notifications.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all notifications
     */
    getAll(): Observable<NotificationResonponse> {
        return this._httpClient.get<NotificationResonponse>(ENDPOINTS.notification + `?userId=${this.userId}`).pipe(
            map((notis) => {
                notis.data = notis.data.map((noti) => {
                    noti.read = noti.isRead === 'Read';
                    return noti;
                });

                return notis;
            }),
            tap((notifications) => {
                console.log(notifications);
                this._notifications.next(notifications.data);
            })
        );
    }

    /**
     * Create a notification
     *
     * @param notification
     */
    create(notification: Notification): Observable<Notification> {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.post<Notification>('api/common/notifications', {notification}).pipe(
                map((newNotification) => {

                    // Update the notifications with the new notification
                    this._notifications.next([...notifications, newNotification]);

                    // Return the new notification from observable
                    return newNotification;
                })
            ))
        );
    }

    /**
     * Update the notification
     *
     * @param id
     * @param notification
     */
    update(id: string, notification: Notification): Observable<Notification> {
        let status = notification.isRead;
        let statusBoolean = notification.isRead == 'Read';

        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.patch<Notification>(ENDPOINTS.notification + `/${id}?status=${status}`, {
                id,
                notification
            }).pipe(
                map((updatedNotification: Notification) => {

                    // Find the index of the updated notification
                    const index = notifications.findIndex(item => item.id === id);

                    // Update the notification
                    notifications[index].read = statusBoolean;

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the updated notification
                    return updatedNotification;
                })
            ))
        );
    }

    /**
     * Delete the notification
     *
     * @param id
     */
    delete(id: string): Observable<boolean> {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.delete<boolean>('api/common/notifications', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted notification
                    const index = notifications.findIndex(item => item.id === id);

                    // Delete the notification
                    notifications.splice(index, 1);

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): Observable<boolean> {

        this.notifications$
            .pipe(take(1))
            .subscribe(notifications => {
            notifications.forEach(notification => {
                notification.isRead = 'Read';
                this.update(notification.id, notification).subscribe();
                this._notifications.next(notifications);
            });

            // this._notifications.next(notifications);
        });

        return of(true);
    }
}
