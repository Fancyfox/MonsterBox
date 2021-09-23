import { PanelBase, UITYpes } from "./PanelBase";


export default class Loading extends PanelBase {
    private _loading: Laya.Image;
    private _uiBox: Laya.Box;
    private _round: Laya.Image;
    public type: UITYpes = UITYpes.TIP;
    private _startRotate: boolean = false;

    onAwake() {
        this._loading = this.owner as Laya.Image;
        this._uiBox = this._loading.getChildAt(0) as Laya.Box;
        this._round = this._uiBox.getChildByName("Round") as Laya.Image;
    }

    onUpdate() {
        if (Laya.timer.delta > 100) {
            return;
        }

        if (this._startRotate) {
            this._round.rotation += 20;
        }
    }

    show() {
        super.show();
        this._startRotate = true;
    }

    hide() {
        super.hide();
        this._startRotate = false;
        this._round.rotation = 0;
        console.log("hide+++++++++++")
    }
}