
import EventManager from "../script/Singleton/EventManager";
import { EventName } from "../script/Singleton/GameDefine";
import Vector3 = Laya.Vector3;
import Handler = Laya.Handler;
import Transform3D = Laya.Transform3D;


export default class Entity extends Laya.Script3D {
    public transform: Transform3D;

    onAwake() {
        EventManager.register(EventName.SCENE_CLEAR, this.onClearScene,this);
        this.transform = this.owner['transform'];
    }

    destroy() {
        if (this.owner) {
            this.owner.removeSelf();
            this.owner.destroy();
        }
        if (!this.destroyed) this.destroy();
    }

    onDestroy() {
        Laya.timer.clearAll(this);
    }

    onUpdate() {
    }


    smoothDestroy(aniDur: number = 1000) {
        if (this.destroyed) return;
        this.owner.traverse(s => {
            if (s instanceof Laya.MeshSprite3D) {
                let m = (s as Laya.MeshSprite3D).meshRenderer.material as Laya.BlinnPhongMaterial;
                m.renderMode = 2;
                Laya.Tween.to(m, { albedoColorA: 0 }, aniDur, Laya.Ease.linearNone, Handler.create(null, () => {
                    this.destroy();
                }));
            }
        });
    }

    smoothBlack(aniDur: number = 500, destroyFinish: boolean = true) {
        if (this.destroyed) return;
        this.owner.traverse(s => {
            if (s instanceof Laya.MeshSprite3D) {
                let m = (s as Laya.MeshSprite3D).meshRenderer.material as Laya.BlinnPhongMaterial;
                m.renderMode = 2;
                Laya.Tween.to(m, { _ColorR: 0, _ColorG: 0, _ColorB: 0 }, aniDur, Laya.Ease.linearNone, Handler.create(null, () => {
                    destroyFinish && this.destroy();
                }));
            }
        });
    }

    smoothBlackSkinned(aniDur: number = 500, destroyFinish: boolean = true) {
        if (this.destroyed) return;
        this.owner.traverse(s => {
            if (s instanceof Laya.SkinnedMeshSprite3D) {
                let m = (s as Laya.SkinnedMeshSprite3D).skinnedMeshRenderer.material as Laya.BlinnPhongMaterial;
                m.renderMode = 2;
                Laya.Tween.to(m, { _ColorR: 0, _ColorG: 0, _ColorB: 0 }, aniDur, Laya.Ease.linearNone, Handler.create(null, () => {
                    destroyFinish && this.destroy();
                }));
            }
        });
    }

    protected onClearScene() {
        Laya.timer.clearAll(this);
    }
}