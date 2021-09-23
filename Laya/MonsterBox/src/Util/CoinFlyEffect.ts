// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Constants } from "../Data/Constants";
import Mathf from "../script/Extensions/Mathf";
import GamePage from "../script/Pages/GamePage";
import AudioManager from "../script/Singleton/AudioManager";
import Pool from "../script/Singleton/Pool";
import Info from "../script/UI/Info";
import { PanelBase, UITYpes } from "../script/UI/PanelBase";
import RandomUtil from "./RandomUtil";



export interface Effect {
    parent: Laya.Node,
    count: number,
    startPos: Laya.Vector2,
    prefab: any,
    endPos?: Laya.Vector2,
    cb?: Function,
    createEffect()
}



// -----

// ----
export class FlyCoin implements Effect {
    parent: Laya.Box;
    count: number;
    startPos: Laya.Vector2;
    prefab: any;
    endPos?: Laya.Vector2;
    cb?: Function;

    constructor(parent: Laya.Box, count: number, startPos: Laya.Vector2, prefab: any, endPos: Laya.Vector2, cb: Function) {
        this.parent = parent;
        this.count = count;
        this.startPos = startPos;
        this.prefab = prefab;
        this.endPos = endPos;
        this.cb = cb;
    }

    createEffect() {
        return new Promise<void>(resolve => {
            let arr = []
            for (let i = 1; i <= this.count; i++) {

                let dt = (400 / this.count) * i * Math.PI / 180,
                    dx = this.startPos.x + RandomUtil.Random(150, 200) * Math.cos(dt),
                    dy = this.startPos.y + RandomUtil.Random(150, 200) * Math.sin(dt),
                    coinNode: Laya.Sprite = Pool.getCoin(this.prefab, this.parent);//this.getCoin(this.coinPrefab);
                coinNode.active = true;
                coinNode.x = this.startPos.x;
                coinNode.y = this.startPos.y;
                coinNode.visible = true;
                // let anima = coinNode.getComponent(cc.Animation);
                //anima.enabled = true;
                // let clip: cc.AnimationClip = anima.getClips()[0];
                //clip.speed = 1.2;
                // anima.play("Coin", 0);
                coinNode.scale(0.65, 0.65);
                let time1 = RandomUtil.Random(0.2, 0.5) / 1.5,
                    time2 = RandomUtil.Random(0.8, 1.1) / 1.5;
                arr.push(new Promise<void>(resolve2 => {
                    Laya.Tween.to(coinNode, { x: dx, y: dy }, time1 * 1000, null, Laya.Handler.create(this, () => {
                        Laya.Tween.to(coinNode, { x: this.endPos.x, y: this.endPos.y }, time2 * 1000, Laya.Ease.cubicIn,
                            Laya.Handler.create(this, () => {
                                if (this.count % 2 == 0) {
                                    AudioManager.instance().playEffect("Reward");
                                }
                                coinNode.scale(0.9, 0.9);
                                Laya.Tween.to(coinNode, { scaleX: 1, scaleY: 1 }, 50, null, Laya.Handler.create(this, () => {
                                    Laya.Tween.to(coinNode, { scaleX: 0.9, scaleY: 0.9 }, 50, null, Laya.Handler.create(this, () => {
                                        Pool.putCoin(coinNode);
                                        resolve2();
                                    }));
                                }))
                            }))
                    }))


                }));
            }
            Promise.all(arr).then(() => {
                if (this.cb) this.cb();
                resolve();
            });
        });
    }
}




export enum FlyEffectType {
    Coin = 1,
    Heat,
    Micro,
    DropCoin
}


export default class CoinFlyEffect extends PanelBase {
    public type: UITYpes = UITYpes.EFFECT;
    private effect: Effect;
    private _effectCount = 0;
    /** @prop {name:coinPrefab,tips:"预制体对象",type:Prefab}*/
    coinPrefab: Laya.Prefab;
    public show(start: Laya.Vector2, callback: Function, count: number, coin: Laya.Prefab) {
        // this.node.parent.getComponent(cc.BlockInputEvents).enabled = false;
        let call = callback
        let num = count
        this.CreateMultiplyFlyEffect(num, start, call, coin);

    }
    public hide() {

    }



    public CreateMultiplyFlyEffect(num: number, startPos: Laya.Vector2, cb: Function = null, coinPrefab: Laya.Prefab) {
        this._effectCount++;
        let endPos: Laya.Vector2 = Info.instance.getCoinInfoPos();
        let parent: Laya.Box = this.owner.getChildAt(0) as Laya.Box;
        this.effect = new FlyCoin(parent, num, startPos, coinPrefab, endPos, cb);
        this.effect.createEffect().then(() => {
            this._effectCount--;
            if (this._effectCount <= 0) {
                GamePage.instance.hidePage(Constants.UIPage.coinEffect);
                this._effectCount = 0;
            }
        })
    }







    private getRandom(min: number = 0, max: number = 1): number {
        return min + (max - min) * Math.random();
    }



}
