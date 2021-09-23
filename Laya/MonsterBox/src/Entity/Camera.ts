
import GameDefine, { EventName, GameState } from "../script/Singleton/GameDefine";

export default class Camera extends Laya.Script3D {
  public static instance: Camera = null;
  private _camera: Laya.Camera;
  private _target: Laya.Sprite3D;
  private _point: Laya.Sprite3D;
  private _cameraPos: Laya.Vector3;



  constructor() {
    super();
    Camera.instance = this;
  }

  onAwake() {
    this._camera = this.owner as Laya.Camera;
    this._cameraPos = this._camera.transform.position.clone();



  }

  onEnable() {

  }

  onDisable() {

  }



  onLateUpdate() {
    if (Laya.timer.delta > 100) {
      return;
    }

    if (GameDefine.gameState != GameState.Playing) {
      return;
    }


    this._lookAtTarget(this._target, this._point);
  }

  private _lookAtTarget(target: Laya.Sprite3D, point: Laya.Sprite3D) {
    if (!target || !point) {
      return;
    }
    let pos = point.transform.position;
    this._cameraPos.setValue(pos.x, pos.y, pos.z);
    this._camera.transform.position = this._cameraPos;
    this._camera.transform.lookAt(target.transform.position, Laya.Vector3.up);

  }













}