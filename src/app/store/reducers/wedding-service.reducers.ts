import {ActionEnum} from "../../shared/enums/action.enum";

export const weddingServiceFeatureKey = 'weddingServiceState';

export interface WeddingServiceState {

  crud: {
    error: any;
    action: ActionEnum;
  };
}

export const initialState: WeddingServiceState = {
  crud: {
    error: '',
    action: ActionEnum.None,
  },
};

