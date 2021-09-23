import { Configuration } from "../../Data/Configuration";
import { Constants } from "../../Data/Constants";
import DateUtil from "../../Util/DateUtil";
import TimerUtil from "../../Util/TimerUtil";
import GameRecorderManager from "./GameRecorderManager";

export default class DailyManager {
    static _instance: DailyManager = null;
    public static instance() {
        if (!this._instance) {
            this._instance = new DailyManager();
        }

        return this._instance;
 }

 private _dailyTick: number = -1;
 private _dailyTimer: number = -1;
 private _leftTime: number = -1;

    public loadFromCache() {
        const dailyTick = Configuration.instance().getConfigData(Constants.DailyTick);
        if (dailyTick) {
            this._dailyTick = JSON.parse(dailyTick);
        }
        let now = new Date().getTime();
        if (now > this._dailyTick) {
            //Daily logic todo

            this._dailyTick = DateUtil.GetNextDay(now).getTime();
            this.saveDailyTicktoCache();
            GameRecorderManager.instance().resetHRecord();
        }
       
        this._startTimer();
    }

    public saveDailyTicktoCache() {
        const data = JSON.stringify(this._dailyTick);
        Configuration.instance().setConfigData(Constants.DailyTick, data);
    }

    private _startTimer() {
        TimerUtil.clear(this._dailyTimer);
        let now = new Date().getTime();
        this._leftTime = DateUtil.GetNextDay(new Date()).getTime() - now;
        this._dailyTimer = TimerUtil.start(null, this._refreshDaily.bind(this), this._leftTime, 1)
    }

    private _refreshDaily() {
        let now = new Date().getTime();
        this._dailyTick = DateUtil.GetNextDay(now).getTime();
        this.saveDailyTicktoCache();
        GameRecorderManager.instance().resetHRecord();
        this._startTimer();
    }

}