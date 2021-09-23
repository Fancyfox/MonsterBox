import Vector3 from "../Extensions/Vector3";
import GameDefine from "./GameDefine";

export default class Pool {
    private static _instance: Pool;
    public static get instance() {
        if (!this._instance) this._instance = new Pool();
        return this._instance;
    }


    private static handle = new Map<string, Laya.Sprite3D[]>();

    /**对象池生产对象
     * @param name 对象名称  
     * @param parent 父节点
     * @param pos 坐标 默认为初始坐标
     */
    public static spawnObj(name: string, parent: Laya.Sprite3D, pos: Laya.Vector3 = Laya.Vector3.zero): Laya.Sprite3D {
        let obj: Laya.Sprite3D;
        if (this.handle.has(name) && this.handle.get(name).length > 0) {
            obj = this.handle.get(name).pop();
            parent.addChild(obj)
        } else {
            let prefab = Laya.loader.getRes(GameDefine.prefabRoot + name + ".lh");
            obj = Laya.Sprite3D.instantiate(prefab, parent, true) as Laya.Sprite3D;
        }
        obj.transform.position = pos;
        obj.active = true;
        return obj;
    }

    /**回收对象到对象池
     * @param target 回收对象
     * @param name 对象名称
     */
    public static recycleObj(target: Laya.Sprite3D, name: string) {

        target.removeSelf();
        if (this.handle.has(name)) {
            this.handle.get(name).push(target);
        } else {
            let pool: Laya.Sprite3D[] = [];
            pool.push(target);
            this.handle.set(name, pool);
        }
    }

    // public static clearPool(name: string) {
    //     if (name && this.handle.has(name)) {
    //         let pool = this.handle.get(name);
    //         let len = pool.length;
    //         for (let i = 0; i < len; i++) {
    //             let obj = pool.pop();
    //         }
    //     }
    // }










}