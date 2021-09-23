import GameData from "./GameData";
import GameDefine from "./GameDefine";
import GameManager from "./GameManager";


export default class EffectUtil {
    private static _instance: EffectUtil;
    public static get instance() {
        if (!this._instance) this._instance = new EffectUtil();
        return this._instance;
    }

    private effects: any = {};

    /**
     * 加载特效
     * @param tag 特效名字
     * @param recycleDelay 回收时间（毫秒） -1：不回收
     * @param parent 父级
     */
    public loadEffect(tag: string, recycleDelay: number = 1000, pos: Laya.Vector3, parent?: any) {
        return new Promise<Laya.Sprite3D>(resolve => {
            if (!this.effects[tag]) this.effects[tag] = [];
            let arr: Laya.Sprite3D[] = this.effects[tag];
            //let pos = new Laya.Vector3();
            if (arr.length > 0) {
                let p = arr.pop();
                (parent || GameManager.instance().scene_3d).addChild(p);
                //parent.addChild(p)
                p.transform.position = pos;
                if (recycleDelay != -1) Laya.timer.once(recycleDelay, this, a => this.recycleEffect(a), [p]);
                resolve(p);
            }
            else {
                Laya.Sprite3D.load(GameDefine.prefabRoot + tag + '.lh', Laya.Handler.create(null, (res: Laya.Sprite3D) => {
                    let ins = Laya.Sprite3D.instantiate(res) as Laya.Sprite3D;
                    (parent || GameManager.instance().scene_3d).addChild(ins);
                    //parent.addChild(ins)
                    ins.transform.position = pos;
                    if (recycleDelay != -1) Laya.timer.once(recycleDelay, this, a => this.recycleEffect(a), [ins]);
                    resolve(ins);
                }));
            }
        });
    }

    /**
     * 回收特效
     * @param p 特效实例
     * @param parent 父级
     */
    public recycleEffect(p: Laya.Sprite3D) {
        p.removeSelf();
        if (!this.effects[p.name]) return;
        this.effects[p.name].push(p);
    }

    public clear() {
        for (const k in this.effects) {
            if (this.effects.hasOwnProperty(k)) {
                const arr = this.effects[k];
                arr.map(p => p.destroy());
            }
        }
        this.effects = {};
    }
}