import { Configuration } from "../../Data/Configuration";
import { Constants } from "../../Data/Constants";





export default class GameRecorderManager {

    static _instance: GameRecorderManager = null;
    public static instance() {
        if (!this._instance) {
            this._instance = new GameRecorderManager();
        }

        return this._instance;
    }

    private _recordCount: number = 0;


    public loadFromCache() {
        const info = Configuration.instance().getConfigData(Constants.GameRecordID);

        if (info) {
            this._recordCount = JSON.parse(info);
        }

    }

    public saveInfoToCache() {
        const data = JSON.stringify(this._recordCount);
        Configuration.instance().setConfigData(Constants.GameRecordID, data);
    }


    public canShowReward() {
        if (!Laya.Browser.window.tt) {
            return false;
        }
        return this._recordCount < 1;

    }



    public resetHRecord() {
        this._recordCount = 0;
        this.saveInfoToCache();
    }

    public addRecordCount(){
        if(this.canShowReward()){
            this._recordCount++;
            this.saveInfoToCache();
        }
    }


}
