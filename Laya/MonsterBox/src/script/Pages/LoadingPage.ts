
import { Configuration } from "../../Data/Configuration";
import { MiniGameManager } from "../../Data/MiniGameManager";
import { SdkUitl } from "../../Util/SdkUitl";
import WeChatManager from "../../Util/WeChatManager";
import DailyManager from "../Singleton/DailyManager";
import GameManager from "../Singleton/GameManager";
import GameRecorderManager from "../Singleton/GameRecorderManager";


const width: number = 490;
export default class LoadingPage extends Laya.Script {
    private uiBox: Laya.Box;
    private progress: Laya.Image;
    private _isSubload: boolean = false;
    private _enterGame: boolean = false;
    private _subTask: any = null;
    private _subProgress: number;


    onAwake() {
        this.uiBox = this.owner.getChildAt(0) as Laya.Box;
        this.progress = this.owner.getChildByName("progressBack").getChildByName("progress") as Laya.Image;
        this.progress.width = 1;
    }

    onStart() {
        //加载本地数据
        Configuration.instance().init();
        MiniGameManager.instance().loadLevelFromCache();
        GameRecorderManager.instance().loadFromCache();
        SdkUitl.initGameRecorder();
        DailyManager.instance().loadFromCache();
        SdkUitl.passiveShare();

        //创建视频组件
        SdkUitl.createVideoRewardAd();
        //分包加载
        this.loadSubPackages();
    }


    onUpdate() {
        if (Laya.timer.delta > 100) return;
        if (this._enterGame) return;
        this._refreshProgress();

    }


    private loadSubPackages() {
        //加载分包1 等分包1加载完后加载分包2
        SdkUitl.loadSubpackage("sub1", () => {
            this.subCallback();
        })

        if (this._subTask) {
            this._subTask.onProgressUpdate((res) => {
                this._subProgress = res.progress;

            })
        }

    }

    private _refreshProgress() {
        if (this.progress.width <= 0.9 * width) {
            if (this._subTask) {
                this.progress.width = this._subProgress * 0.9 * width;
            } else {
                this.progress.width += Laya.timer.delta / 1000 * 0.6 * width;
            }
        } else {
            if (this._isSubload) {
                this.progress.width += Laya.timer.delta / 1000 * 0.3 * width;
            }

            if (this.progress.width >= width) {
                this.progress.width = width;
            }

            if (this.progress.width >= width) {
                this.enterGame();
            }
        }

    }

    private subCallback() {
        if (!this._isSubload) {
            Laya.Scene.open("Scenes/Game.scene", false);
            this._isSubload = true;
            SdkUitl.loadSubpackage("sub2", null)
        }
    }
    
    //进入游戏场景
    private enterGame() {
        if (!this._enterGame && GameManager.instance().isGameReady) {
            console.log("enter game!");
            Laya.Scene.close("Scenes/Start.scene")
            this._enterGame = true;
        }
    }


}