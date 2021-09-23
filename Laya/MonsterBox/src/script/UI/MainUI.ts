import { PanelBase, UITYpes } from "./PanelBase";

/**游戏主界面UI */
export default class MainUI extends PanelBase {
    public type: UITYpes = UITYpes.PANEL;
    private _mainView: Laya.Image;
    private _uiBox: Laya.Box;
    /**游戏开始按钮 */
    private _startBtn: Laya.Button;
    /**设置按钮 */
    private _settingBtn: Laya.Button;
    /**森林场景按钮 */
    private _safariSceneBtn: Laya.Button;
    /**公园场景按钮 */
    private _cityParkSceneBtn: Laya.Button;
    /**胶囊列表 */
    private _boxList: Laya.List;

    constructor() {
        super();
    }

    onAwake() {
        console.log("onawake")
        this._mainView = this.owner as Laya.Image;
        this._uiBox = this._mainView.getChildAt(0) as Laya.Box;
        this._startBtn = this._uiBox.getChildByName("StartBtn") as Laya.Button;
        this._settingBtn = this._uiBox.getChildByName("SettingBtn") as Laya.Button;
        this._safariSceneBtn = this._uiBox.getChildByName("SafariSceneBtn") as Laya.Button;
        this._cityParkSceneBtn = this._uiBox.getChildByName("CityparkSceneBtn") as Laya.Button;
        this._boxList = this._uiBox.getChildByName("BoxList") as Laya.List;
    }

    onStart() {
        //监听按钮事件
        this._startBtn.on(Laya.Event.CLICK, this, this._startGame);
        this._settingBtn.on(Laya.Event.CLICK, this, this._showSetting);
        this._safariSceneBtn.on(Laya.Event.CLICK, this, this._enterSafariSecene);
        this._cityParkSceneBtn.on(Laya.Event.CLICK, this, this._enterCityparkScene);
    }



    private _startGame() {

    }

    private _showSetting() {

    }

    /**进入森林场景 */
    private _enterSafariSecene() {

    }

    /**进入公园场景 */
    private _enterCityparkScene() {

    }

}