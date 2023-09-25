import {createAction, props} from "@ngrx/store";


export const loadWeddingServices = createAction('[WSS] Load WeddingServices');


// export const loadWeddingServicesSuccess = createAction(
//   '[OfficeManagement] Load OfficeManagements Success',
//   props<{ data: OfficeManagementData }>()
// );

export const loadWeddingServicesFailure = createAction(
  '[WSS] Load WSS Failure',
  props<{ error: any }>()
);
