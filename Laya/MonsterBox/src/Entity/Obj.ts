import Vector3 = Laya.Vector3;
import Quaternion = Laya.Quaternion;
import Handler = Laya.Handler;
import Sprite3D = Laya.Sprite3D;
import Transform3D = Laya.Transform3D;
import Entity from "./Entity";
import GameData from "../script/Singleton/GameData";

//import GameManager from "../singleton/GameManager";


export default class Obj extends Entity {
    public get tag() {
        return this.data.tag;
    }

    public get entityId() {
        return this.data.id;
    }

    protected data: any;

    init(data: any) {
        this.data = data;

        let p = new Vector3();
        let q = new Quaternion();
        let s = new Vector3();

        let m = new Laya.Matrix4x4().fromArray(data.transform);
        this.transform.worldMatrix = m;
    }

    onDestroy() {
        super.onDestroy();
        // delete GameManager.instance.entitys[this.entityId];
    }
}