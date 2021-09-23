

export interface ITimerObj{
    target: any,
    callback: Function,
    interval: number,
    repeatTimes: number,
    endCallback: Function,
    curTimes: number,
    args: any[]
}

export interface TimerObj{
    timerId: number,
    timerObj: ITimerObj
}


export default class TimerUtil {
    private static _timerMap = null;

    public static start(targetObj, callback: Function, interval: number, repeatTimes = -1, endCallback = null, ...args: any[]){
        let timerObj: ITimerObj = {
            target: targetObj,
            callback: callback,
            interval: interval,
            repeatTimes: repeatTimes,
            endCallback: endCallback,
            curTimes: 0,
            args: args
        }

        if(!callback || !callback.apply){
            console.trace();
        }

        let mapObj: TimerObj = {
            timerId: 0,
            timerObj: timerObj
        };
        mapObj.timerId = setInterval(this._getIntervalCallback(mapObj).bind(this), interval);

        this._add(mapObj)

        return mapObj.timerId;
    }

    public static clear(obj){
        if(typeof obj === 'number'){
            this._clear(obj);
            return;
        }

        if(obj instanceof Array){
            while(obj.length){
                let item = obj.pop();
                typeof item === 'number' && this._clear(item);
            }
            return;
        }
    }


    private static _clear(timerId){
        timerId = timerId >> 0;

        if(timerId < 0){
            return;
        }

        clearInterval(timerId);

        let timerObj = this._has(timerId);
        if(!timerObj){
            return;
        }
        this._timerMap.delete(timerId);
    }
    
    private static _add(timerObj: TimerObj){
        this._timerMap = this._timerMap || new Map();
        this._timerMap.set(timerObj.timerId, timerObj);
    }   

    private static _has(timerId){
        timerId = timerId >> 0;
        if(timerId < 0 || !this._timerMap || !this._timerMap.has(timerId)){
            return false;
        }

        return this._timerMap.get(timerId);
    }

    
    private static _getIntervalCallback(timerObj: TimerObj){
        return function () {
            let iTimerObj = timerObj.timerObj;
            iTimerObj.curTimes++;
            iTimerObj.callback.call(iTimerObj.target, iTimerObj.args);
            //iTimerObj.callback.apply(iTimerObj.target, [{cur: iTimerObj.curTimes, total: iTimerObj.repeatTimes}].concat(iTimerObj.args));
            if(iTimerObj.repeatTimes > 0 && iTimerObj.curTimes >= iTimerObj.repeatTimes){
                this._clear(timerObj.timerId);
                if(iTimerObj.endCallback){
                    iTimerObj.endCallback.call(iTimerObj.target);
                }
            }
        }
    }
}
