import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {ENDPOINTS} from "../../../../core/global.constants";
import {Dashboard} from "./dashboard.types";

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private _data: BehaviorSubject<Dashboard> = new BehaviorSubject(null);

    githubIssues = {
        overview: {
            'this-week': {
                'new-issues': 214,
                'closed-issues': 75,
                'fixed': 168,
                'wont-fix': 46,
                're-opened': 68,
                'needs-triage': 7
            },
            'last-week': {
                'new-issues': 197,
                'closed-issues': 72,
                'fixed': 172,
                'wont-fix': 25,
                're-opened': 66,
                'needs-triage': 6
            }
        },
        labels: ['Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        series: {
            'this-week': [
                {
                    name: 'Doanh thu',
                    type: 'column',
                    data: [{
                        x: 'category A',
                        y: 10
                    }]
                }
            ],
            'last-week': [
                {
                    name: 'Doanh Thu',
                    type: 'column',
                    data: [{
                        x: 'category A',
                        y: 10
                    }]
                }
            ]
        }
    }
    schedule = {
        today: [
            {
                title: 'Trang trí',
                value: 6,
            }
        ],
        tomorrow: [
            {
                title: 'Sinh nhật của Duy',
                value: 10,
            }
        ]
    };

    orderByCate = [
        {
            title: 'Trang trí',
            value: 6,
        }
    ]

    partnerHighestRevenue = [{
        name: 'Nguyễn Văn A',
        value: 10000000,
    }, {
        name: 'Nguyễn Văn B',
        value: 9000000,
    }, {
        name: 'Nguyễn Văn C',
        value: 8000000,
    }
    ]

    memberCate = {
        partner: [
            {
                title: 'Trang trí',
                value: 6,
            }
        ],
        staff: [
            {
                title: 'Sinh nhật của Duy',
                value: 10,
            }
        ]
    };

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<Dashboard> {
        return this._httpClient.get<Dashboard>(ENDPOINTS.dashboard).pipe(
            tap((response: any) => {
                // month
                let currentMonth = new Date().getMonth() + 1;
                let includeMonth = [];
                for (let i = currentMonth - 5 > 0 ? currentMonth - 5 : 1; i <= currentMonth; i++) {
                    includeMonth.push(`${i}`);
                }
                let dtm = Object.keys(response.totalRevenueMonth[0])
                    .filter((key) => includeMonth.includes(key))
                    .map((key) => {
                        return {
                            x: `Tháng ${key}`,
                            y: response.totalRevenueMonth[0][key]
                        }
                    });
                this.githubIssues.series["last-week"][0].data = dtm;

                // year
                let currentYear = new Date().getFullYear();
                let includeYear = [];
                for (let i = currentYear - 3 > 0 ? currentYear - 3 : 1; i <= currentYear; i++) {
                    includeYear.push(`${i}`);
                }
                let dty = Object.keys(response.totalRevenueYear[0])
                    .filter((key) => includeYear.includes(key))
                    .map((key) => {
                        return {
                            x: `Năm ${key}`,
                            y: response.totalRevenueYear[0][key]
                        }
                    });
                this.githubIssues.series["this-week"][0].data = dty;
            }),

            tap((response: any) => {
                this.schedule.today = response.serviceQuantity.map((item) => {
                    return {
                        title: Object.keys(item)[0],
                        value: Object.values(item)[0],
                    }
                });
            }),
            tap((response: any) => {
                this.memberCate.partner = response.partner.map((item) => {
                    return {
                        title: Object.keys(item)[0],
                        value: Object.values(item)[0],
                    }
                });
                this.memberCate.staff = response.staff.map((item) => {
                    return {
                        title: Object.keys(item)[0],
                        value: Object.values(item)[0],
                    }
                });
            }),
            tap((response: any) => {
                this.partnerHighestRevenue = response.partnerPayment.map((item) => {
                    return {
                        name: Object.keys(item)[0],
                        value: Object.values(item)[0],
                    }
                }).sort((a, b) => b.value - a.value).slice(0, 3);
            }),
            tap((response: any) => {
                this.orderByCate = response.serviceOrder.map((item) => {
                    return {
                        title: Object.keys(item)[0],
                        value: Object.values(item)[0],
                    }
                });
            }),
            map((response: Dashboard) => ({
                ...response,
                totalService: response.serviceQuantity.reduce((a, b) => a + Object.values(b)[0], 0),
                // totalOrder: response.serviceOrder.reduce((a, b) => a + Object.values(b)[0], 0),
                githubIssues: this.githubIssues,
                schedule: this.schedule,
                partnerHighestRevenue: this.partnerHighestRevenue,
                memberCate: this.memberCate,
                orderByCate: this.orderByCate,
            })),
            tap((response: any) => {
                console.log(response);
                this._data.next(response);
            }),
        );
    }
}
