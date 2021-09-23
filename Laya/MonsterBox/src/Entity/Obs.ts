import Vector3 = Laya.Vector3;
import Quaternion = Laya.Quaternion;
import Handler = Laya.Handler;
import Sprite3D = Laya.Sprite3D;
import Transform3D = Laya.Transform3D;
import Entity from "./Entity";

import Obj from "./Obj";
import GameDefine, { GameState } from "../script/Singleton/GameDefine";
import CannonManager from "../script/Singleton/CannonManager";

//import GameManager from "../singleton/GameManager";
//import WXUtil from "../singleton/WXUtil";
//import Player from "./Player";


export default class Obs extends Obj {
    private obs:Laya.MeshSprite3D;
    public attached: boolean;
    public body: CANNON.Body;
    protected bodys: any[];
    protected animator: Laya.Animator;
    protected moveBySelf: boolean = false;
    protected enableContact: boolean = false;
    private rdActiveFlag = false;
    protected activeDis = 30;
    private playerPos: Vector3;
    private playerPos1: Vector3;
    private ready = false;
    private interval = 5;
    private curFrame = 0;
    protected group: number;
    protected mask: number;
    protected allowSleep = false;
    protected friction: number = 0.1;
    private preFrame = 0;
    private preId = 0;

    private contacts: CANNON.Body[] = [];
    private deleteQue: number[] = [];
    private deleteIndex: number = 0;
    protected checkExitInterval = 5;
    private checkExitIndex = 0;
    private bodyIndex: number = 0;


    private rigibody:Laya.Rigidbody3D;
    private collider:Laya.PhysicsCollider;
    onAwake() {
        super.onAwake();
        this.obs=this.owner as Laya.MeshSprite3D;
        this.animator = this.obs.getComponent(Laya.Animator);
        this.rigibody=this.obs.getComponent(Laya.Rigidbody3D);
        }

    onStart(){
       
    }    

    preInit(data: any) {
        this.rigibody.collisionGroup=GameDefine.CollisionGroup_Obs;
      
    }

    init(data: any) {
        super.init(data);
        this.preInit(data);
       // this.attached = false;
       // this.attackCannon();
        if(this.rigibody){
          
        }
      
       // ES.instance.on(ES.on_player_loaded, this, this.onPlayerLoaded);
    }

    onGameReset(){
      this.init(this.data);
      Laya.timer.clearAll(this);
      this.rigibody.linearVelocity=new Laya.Vector3(0,0,0);
      this.rigibody.angularVelocity=new Laya.Vector3(0,0,0);
    }

    
    onUpdate(){
        
    }

    

    attackCannon() {
        if (this.data.components) {
            this.bodys = CannonManager.instance.attachTransform(this.transform, this.moveBySelf, this.data, this.onCollide.bind(this), this.group, this.mask, this.friction);
            this.body = this.bodys[0].body;
            
            this.bodys.map(o => {
                o.body.allowSleep = this.allowSleep;
                if (this.allowSleep) o.body.sleep();
               // else o.body.wakeUp();
            });
        }
        this.attached = true;
    }

    onCollide(e) {
        let frame = Laya.timer.currFrame;
        let id = e.body.id;
        if (frame === this.preFrame && id === this.preId) return;
        this.preFrame = frame;
        this.preId = id;
        this.onEnter(e.body);
        if (this.enableContact) {
            if (this.body.collisionFilterMask & e.body.collisionFilterGroup && this.contacts.indexOf(e.body) === -1) {
                this.contacts.push(e.body);
            }
        }
    }

    isContact(body: CANNON.Body) {
        if (!this.body) return;
        for (var i = 0; i < this.body.world.contacts.length; i++) {
            var c = this.body.world.contacts[i];
            if ((c.bi === this.body && c.bj === body) || (c.bi === body && c.bj === this.body)) {
                return true;
            }
        }
        return false;
    }

    private checkExit(index: number) {
        let body = this.contacts[index];
        if (!body) return;
        if (!this.isContact(body)) {
            this.onExit(body);
            delete this.contacts[index];
            this.deleteIndex++;
        }
    }

    onEnter(body: CANNON.Body) {
        // switch(body.tag)
        // {
        //     case "ball":
        //    console.log("touchBall");
            
        //     ES.instance.event(ES.msg_touch_ball);
        //     break
        // }
    }

    onExit(body: CANNON.Body) {
    }

    destroy() {
        if (this.bodys) this.bodys.map(o => CannonManager.instance.removeBody(o.transform));
        super.destroy();
    }

    onLateUpdate() {
        super.onLateUpdate();
        if (!this.ready) return;

        let dis = this.transform.position.z - this.playerPos.z;
        this.onPlayerMove(dis);

        if (this.bodys) {

            if (this.enableContact) {
                if (this.contacts.length > 0) {
                    if (this.checkExitIndex++ >= this.checkExitInterval) {
                        this.checkExitIndex = 0;
                        this.checkExit(this.bodyIndex++);
                        if (this.bodyIndex >= this.contacts.length) this.bodyIndex = 0;
                        if (this.deleteIndex === this.contacts.length) {
                            this.contacts = [];
                            this.deleteIndex = 0;
                        }
                    }
                }
            }
            if (this.tag != 'RelivePoint') {
                if (this.curFrame++ > this.interval) {
                    this.curFrame = 0;
                    if (dis < -this.activeDis || this.body.velocity.y < -100) {
                        for (let i = 0, len = this.bodys.length; i < len; i++) {
                            let o = this.bodys[i];
                            CannonManager.instance.removeBody(o.transform);
                        }
                        this.bodys = null;
                        this.ready = false;
                        // this.destroy();
                    }
                }
            }
        }
    }

    onPlayerMove(dis: number) {
        if (dis < 15 && !this.attached) {
            this.attackCannon();
        }
    }

    onFinal(){
        if(this.rigibody){
            this.rigibody.enabled=false;
        }
    }
}