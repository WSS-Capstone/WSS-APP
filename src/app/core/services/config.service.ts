import {Injectable} from "@angular/core";
import {ConfigData} from "../models/config-data";
import {GLOBAL_CONSTANTS} from "../models/global.constants";

@Injectable({
  providedIn: 'root',
})
export class ConfigService {

  constructor(
    private configData: ConfigData,
  ) {
  }

  getConfig(){
      this.configData.loginApi = GLOBAL_CONSTANTS.wss_api + GLOBAL_CONSTANTS.login_api;
      this.configData.registerApi = GLOBAL_CONSTANTS.wss_api + GLOBAL_CONSTANTS.register_api;
    }
}
