import Transform3D = Laya.Transform3D;
import Vector3 = Laya.Vector3;
import Vec3 = CANNON.Vec3;
import Body = CANNON.Body;

//import GameManager from "./GameManager";
import MeshUtil from "../Extensions/MeshUtil";
import GameManager from "./GameManager";
import EventManager from "./EventManager";
import { EventName } from "./GameDefine";
//import Log from "./Log";

export default class CannonManager {
    private static _instance: CannonManager;
    public static get instance() {
        if (!CannonManager._instance) CannonManager._instance = new CannonManager();
        return CannonManager._instance;
    }

    public world: CANNON.World;
    public gravity = -20;
    public cannonStep: number = 1;
    public cannonRefreshDelta: number;
    public que: any[] = [];
    public removeQue: any[] = [];

    private debugSprites: Array<Laya.Sprite3D> = new Array<Laya.Sprite3D>();
    private touchRay: Laya.Ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
    private ray: CANNON.Ray = new CANNON.Ray();

    private result: CANNON.RaycastResult = new CANNON.RaycastResult();
    private hitInfo: Laya.HitResult = new Laya.HitResult();
    private outinfo: Laya.HitResult = new Laya.HitResult();
    private forward: Laya.Vector3 = new Laya.Vector3(0, 0, 1);


    public getTouchPos3D(camera: Laya.Camera, drawPlane: Laya.Sprite3D, pos: Laya.Vector3): Laya.Vector3 {
        let pos_2: Laya.Vector2 = new Laya.Vector2(pos.x, pos.y);
        camera.viewportPointToRay(pos_2, this.touchRay)
        this.touchRay = this.touchRay;
        let hitPoint = this.getIntersectWithLineAndPlane(this.touchRay.origin, this.touchRay.direction, this.forward, drawPlane.transform.position)
        return hitPoint;
    }

    private temp_vec3_1: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
    private temp_vec3_2: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
    private temp_vec3_3: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
    /**
     * 获取直线与平面的交点
     * @param point 直线上面某一点
     * @param direct 直线的方向
     * @param planeNormal 垂直于平面的向量
     * @param planePoint 平面上的任意一点
     */
    public getIntersectWithLineAndPlane(point: Laya.Vector3, direct: Laya.Vector3, planeNormal: Laya.Vector3, planePoint: Laya.Vector3) {
        Laya.Vector3.subtract(planePoint, point, this.temp_vec3_1);
        this.temp_vec3_1 = this.temp_vec3_1;
        let mul = Laya.Vector3.dot(direct, planeNormal);
        this.temp_vec3_2.setValue(planeNormal.x / mul, planeNormal.y / mul, planeNormal.z / mul);
        let d: number = Laya.Vector3.dot(this.temp_vec3_1, this.temp_vec3_2);
        Laya.Vector3.normalize(direct, this.temp_vec3_1);
        this.temp_vec3_1 = this.temp_vec3_1;
        Laya.Vector3.scale(this.temp_vec3_1, d, this.temp_vec3_1);
        this.temp_vec3_1 = this.temp_vec3_1;
        Laya.Vector3.add(this.temp_vec3_1, point, this.temp_vec3_3);
        this.temp_vec3_3 = this.temp_vec3_3;
        let pos: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
        pos.setValue(this.temp_vec3_3.x, this.temp_vec3_3.y, this.temp_vec3_3.z);
        return pos

    }

    public enableCannonWorld() {
        // Log.log('enable cannon world!');
        console.log('enable cannon world!');

        this.world = new CANNON.World();
        this.world.gravity.set(0, this.gravity, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.quatNormalizeFast = false;
        this.world.quatNormalizeSkip = 0;
        this.world.defaultContactMaterial.restitution = 0;
        this.world.defaultMaterial.restitution = -1;
        this.cannonRefreshDelta = this.cannonStep / 60;
        EventManager.register(EventName.NEXT_LEVEL, this.clear, this)
        Laya.timer.frameLoop(this.cannonStep, this, this.updateCannonWorld);
        this.setWorldIterations(10);
    }

    public attachTransform(transform: Transform3D, moveByUser: boolean, data: any, collideCallback: Function = null, group: number = 1, mask: number = -1, friction: number = 0.1, restitution: number = 0.06) {
        let ret: any[];
        if (data.components) {
            ret = [];
            data.components.map(c => {
                let t: Laya.Sprite3D = transform.owner.find(c.path) as Laya.Sprite3D;
                if (!t) {
                    console.error('can not find', c.path, 'on', transform.owner);
                    return;
                }
                if (c.transform) {
                    t.transform.localMatrix = new Laya.Matrix4x4().fromArray(c.transform);
                }
                let scale = new Vector3().setFromMatrixScale(t.transform.worldMatrix);
                let body = this.addBody(t['transform'], c, scale.toArray(), moveByUser, group, mask, friction, restitution);
                body.tag = data.tag;
                if (collideCallback) body.addEventListener('collide', collideCallback);
                ret.push({
                    body: body,
                    transform: t['transform']
                });
            });
            //console.log('attachBody:', data.tag, 'moveByUser:', moveByUser, data);

            // Log.log('attachBody:', data.tag, 'moveByUser:', moveByUser);
        }
        return ret;
    }

    public addBody(transform: Transform3D, components: any, scale: number[], moveByUser: boolean, group: number, mask: number, friction: number, restitution: number) {
        let type;
        let mass = 0;
        let angularDrag = 0;
        let drag = 0;
        let linearFactor = new CANNON.Vec3(1, 1, 1);
        let angularFactor = new CANNON.Vec3(1, 1, 1);

        if (components.rigidbody) {
            if (components.rigidbody.isKinematic) type = CANNON.Body.KINEMATIC;
            if (components.rigidbody.useGravity && !components.rigidbody.isKinematic) type = CANNON.Body.DYNAMIC;
            if (!components.rigidbody.useGravity && !components.rigidbody.isKinematic) type = CANNON.Body.STATIC;
            mass = components.rigidbody.mass;
            angularDrag = components.rigidbody.angularDrag;
            drag = components.rigidbody.drag;
            let cons = components.rigidbody.constraints;
            linearFactor.x = cons & 2 ? 0 : 1;
            linearFactor.y = cons & 4 ? 0 : 1;
            linearFactor.z = cons & 8 ? 0 : 1;
            angularFactor.x = cons & 16 ? 0 : 1;
            angularFactor.y = cons & 32 ? 0 : 1;
            angularFactor.z = cons & 64 ? 0 : 1;

        }
        else {
            type = CANNON.Body.STATIC;
        }

        let body = new CANNON.Body({
            position: new CANNON.Vec3(transform.position.x, transform.position.y, transform.position.z),
            quaternion: new CANNON.Quaternion(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w),
            mass: mass,
            type: type,
            material: new CANNON.Material({
                friction: friction,
                restitution: restitution
            }),
            angularVelocity: new CANNON.Vec3(),
            angularDamping: angularDrag,
            velocity: new CANNON.Vec3(),
            linearDamping: drag,
            fixedRotation: false,
            collisionFilterGroup: group,
            collisionFilterMask: mask,
            linearFactor: linearFactor,
            angularFactor: angularFactor
        });

        let trigger = false;
        components.colliders.map(co => {
            if (co.trigger) trigger = true;
        });
        body.collisionResponse = !trigger;

        this.addShape(body, components.colliders, scale, transform.owner);

        body.allowSleep = true;

        // if (moveByUser) body.sleep();
        body.wakeUp()

        this.world.addBody(body);

        this.que.push({
            type: body.type,
            transform: transform,
            body: body,
            moveByUser: moveByUser,
            cposition: new Vec3(),
            cquaternion: new CANNON.Quaternion(),
            lposition: new Vector3(),
            lquaternion: new Laya.Quaternion(),
        });

        return body;
    }

    public removeBody(transform: Transform3D) {
        let link = this.queryLinkByTransform(transform);
        if (link) {
            this.removeQue.push(link);
            // Log.log('rm', link)
        }
    }

    public convertBodyType(transform: Transform3D, type: number): CANNON.Body {
        let link = this.queryLinkByTransform(transform);
        if (link) {
            link.body.type = type;
            switch (type) {
                case CANNON.Body.STATIC:
                    link.moveByUser = true;
                    link.body.mass = 0;
                    break;
                default:
                    link.moveByUser = false;
                    link.body.mass = 1;
                    break;
            }
            link.body.updateMassProperties();
            link.body.wakeUp();
            return link.body;
        }

    }

    queryLinkByTransform(transform: Transform3D) {
        let index = -1;
        for (let i = 0; i < this.que.length; i++) {
            let d = this.que[i];
            if (!d) continue;
            if (d.transform === transform) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            let t = this.que[index];
            t.index = index;
            return t;
        }
    }

    public addConstraint(c: CANNON.Constraint) {
        this.world.addConstraint(c);
    }

    public removeConstraint(c: CANNON.Constraint) {
        this.world.removeConstraint(c);
    }

    private beforeBodyRemove(body: CANNON.Body) {
        for (let i = 0; i < this.world.constraints.length; i++) {
            let c = this.world.constraints[i];
            if (c.bodyA === body || c.bodyB === body) {
                this.world.constraints.splice(i--, 1);
                //  Log.log('rm constraints', c.id);
            }
        }
    }

    private setWorldIterations(iterations: number) {
        this.world.solver['iterations'] = iterations;
        //Log.log('set iterations', iterations)
    }

    private updateCannonWorld() {
        while (this.removeQue.length > 0) {
            let link = this.removeQue.pop();
            this.beforeBodyRemove(link.body);
            this.world.removeBody(link.body);
            // Log.log('rm body', link.body.tag);
            delete this.que[link.index];
        }
        this.world.step(this.cannonRefreshDelta);
        for (let i = 0; i < this.que.length; i++) {
            let d = this.que[i];
            if (!d) continue;
            if (d.body.sleepState === CANNON.Body.SLEEPING && !d.moveByUser) continue;
            d.moveByUser ? this.bodyFollowTransform(d) : this.transformFollowBody(d);
        }
        // ES.instance.event(ES.refresh_camera_pos);
    }

    private bodyFollowTransform(d: any) {
        d.body.position.x = d.transform.position.x;
        d.body.position.y = d.transform.position.y;
        d.body.position.z = d.transform.position.z;
        d.body.quaternion.x = d.transform.rotation.x;
        d.body.quaternion.y = d.transform.rotation.y;
        d.body.quaternion.z = d.transform.rotation.z;
        d.body.quaternion.w = d.transform.rotation.w;

    }

    private transformFollowBody(d: any) {
        d.lposition.x = d.body.position.x;
        d.lposition.y = d.body.position.y;
        d.lposition.z = d.body.position.z;
        d.lquaternion.x = d.body.quaternion.x;
        d.lquaternion.y = d.body.quaternion.y;
        d.lquaternion.z = d.body.quaternion.z;
        d.lquaternion.w = d.body.quaternion.w;
        d.transform.position = d.lposition;
        d.transform.rotation = d.lquaternion;
    }

    private addShape(body: CANNON.Body, colliders: any[], scale: number[], owner: Laya.Node) {
        for (let i = 0; i < colliders.length; i++) {
            let data = colliders[i];
            if (data.type === 'UnityEngine.BoxCollider') {
                let center = new CANNON.Vec3().set(-data.center[0] * scale[0], data.center[1] * scale[1], data.center[2] * scale[2]);
                let size = new CANNON.Vec3(data.size[0] * scale[0] * 0.5, data.size[1] * scale[1] * 0.5, data.size[2] * scale[2] * 0.5);
                let shape = new CANNON.Box(size);
                body.addShape(shape, center);

                // if (owner.name === 'C3' || owner.name === 'C2' || owner.name === 'jian') {
                // let size2 = size.mult(2);
                // let s = GameManager.instance.genBox(size2.toArray());
                // s.meshFilter.sharedMesh.calculateBounds();
                // let p = new Laya.Vector3(body.position.x, body.position.y, body.position.z);
                // let p2 = new Laya.Vector3().fromArray(center.toArray());
                // owner.addChild(s);
                // s.transform.position = p.vadd(p2);
                // s.transform.rotation = new Laya.Quaternion().fromArray(data.rotation);
                // s.transform.setWorldLossyScale(Vector3.one.clone());
                // }
            }
            else if (data.type === 'UnityEngine.SphereCollider') {
                let center = new CANNON.Vec3().set(-data.center[0] * scale[0], data.center[1] * scale[1], data.center[2] * scale[2]);
                let shape = new CANNON.Sphere(data.radius * scale[0]);
                body.addShape(shape, center);
            }
            else if (data.type === 'UnityEngine.CapsuleCollider') {
                let center = new CANNON.Vec3().set(-data.center[0] * scale[0], data.center[1] * scale[1], data.center[2] * scale[2]);
                let shape = new CANNON.Cylinder(data.radius, data.radius, data.height, 9);
                body.addShape(shape, center);
            }
            else if (data.type === 'UnityEngine.MeshCollider') {
                let vertices: Vec3[] = [];
                for (let i = 0; i < data.ver.length; i += 3) {
                    let d = data.ver;
                    let p = new Vec3(d[i], d[i + 1], d[i + 2]);
                    vertices.push(p);
                }
                let tris = MeshUtil.convertFaces(data.tris);
                let shape = new CANNON.ConvexPolyhedron(vertices, tris);
                // Log.log(data, vertices, data.tris)
                body.addShape(shape);
            }
            else {
                console.error('unsuport shape type', data.type);
            }
        }
    }

    clear(index?: number) {
        if (index === 0) {
            this.que = [];
            this.world = null;
            Laya.timer.clearAll(this);
        }
    }
}