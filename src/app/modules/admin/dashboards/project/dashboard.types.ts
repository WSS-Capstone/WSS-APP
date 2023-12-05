export interface Dashboard {
    totalRevenueMonth: KP[];
    totalRevenueYear: KP[];
    totalService: number | null;
    serviceQuantity: KP[];
    totalOrder: number | null;
    serviceOrder: KP[];
    totalFeedback: number | null;
    totalPartner: number | null;
    totalStaff: number | null;
    taskInProgress: number | null;
    taskToDo: number | null;
    totalTask: number | null;
    taskDone: number | null;
    totalOrderDone: number | null;
    negativeFeedback: number | null;
    serviceFeedback: KP[];
    partner: KP[];
    staff: KP[];
    partnerPayment: KP[];
    githubIssues: any;
    schedule: any;
    partnerHighestRevenue: any;
    memberCate: any;
    orderByCate: any;
}

interface KP {
    [key: string]: number;
}


