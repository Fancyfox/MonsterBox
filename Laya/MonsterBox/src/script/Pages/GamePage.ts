import { Configuration } from "../../Data/Configuration";
import { Constants } from "../../Data/Constants";

import { MiniGameManager } from "../../Data/MiniGameManager";
import { SdkUitl } from "../../Util/SdkUitl";

import AudioManager from "../Singleton/AudioManager";
import GameManager from "../Singleton/GameManager";

import { PanelBase, UITYpes } from "../UI/PanelBase";




export default class GamePage extends Laya.Script {
  public static instance: GamePage = null;

  /**一级页面层 */
  private _panelLayer: Laya.Box;
  /**二级弹窗页面层 */
  private _popupLayer: Laya.Box;
  /**提示页面层 */
  private _tipLayer: Laya.Box;
  /**特效页面层 */
  private _effectLayer: Laya.Box;


  /** @prop {name:mainPage,tips:"预制体对象",type:Prefab}*/
  mainPage: Laya.Prefab;

   /** @prop {name:loadingPage,tips:"预制体对象",type:Prefab}*/
   loadingPage: Laya.Prefab;



  private dictPanelMap = new Map<string, Laya.Image>();

  constructor() {
    super();
    GamePage.instance = this;
  }

  onAwake() {

    AudioManager.instance().loadFromCache();
    this._panelLayer = this.owner.getChildByName("PanelLayer") as Laya.Box;
    this._popupLayer = this.owner.getChildByName("PopupLayer") as Laya.Box;
    this._tipLayer = this.owner.getChildByName("TipLayer") as Laya.Box;
    this._effectLayer = this.owner.getChildByName("EffectLayer") as Laya.Box;
  }

  onStart() {
     let level = MiniGameManager.instance().getSceneLevel();
    this.showPage(Constants.UIPage.loading);
    GameManager.instance().loadLevel(level).then(() => {
      console.log("hide loading")
      this.hidePage(Constants.UIPage.loading, () => {
        //to do
        this.showPage(Constants.UIPage.main);
        SdkUitl.loadVideoRewardAd();
      });
    });
  }



  public hidePage(name: string, cb?: Function) {
    if (this.dictPanelMap.has(name)) {
      const panel = this.dictPanelMap.get(name);
      if (panel.parent && panel.parent.active) {
        panel.parent.active = false;
      }
      console.log(name,"name+++++++")
      panel.removeSelf();

      const comp = panel.getComponent(PanelBase);
      if (comp && comp['hide']) {
        comp['hide'].apply(comp);
      }

      if (cb) {
        cb();
      }
    }
  }
  
  public showPage(name: string, cb?: Function, ...args: any[]) {
    if (this.dictPanelMap.has(name)) {
      const panel = this.dictPanelMap.get(name);
      const comp = panel.getComponent(PanelBase);
      const parent = this.getParent(comp.type);
      parent.addChild(panel);
      parent.active = true;
      if (comp && comp['show']) {
        comp['show'].apply(comp, args);
      }
      cb && cb();
      return;
    }
    let prefab = this.getPrefab(name);
    console.log(prefab,"prefab")
    let panel = prefab.create() as Laya.Image;
    this.dictPanelMap.set(name, panel);
    const comp = panel.getComponent(PanelBase);
    const parent = this.getParent(comp.type);
    parent.active = true;
    parent.addChild(panel);

    if (comp && comp['show']) {
      comp['show'].apply(comp, args);
    }

    cb && cb();
  }

  public hideAll() {
    this.dictPanelMap.forEach((panel: Laya.Image) => {
      const comp = panel.getComponent(PanelBase);
      if (comp && comp.isVisible) {
        this.hidePage(panel.name);
      }
    })
  }

  private getParent(type) {
    switch (type) {
      case UITYpes.PANEL:
        return this._panelLayer;
      case UITYpes.POPUP:
        return this._popupLayer;
      case UITYpes.TIP:
        return this._tipLayer;
      case UITYpes.EFFECT:
        return this._effectLayer;
    }
  }

  private getPrefab(name: string) {
    switch (name) {
      case Constants.UIPage.main:
        return this.mainPage;
        case Constants.UIPage.loading:
          return this.loadingPage;
    }
  }

  public getCoinPrefab() {
    //return this.coin;
  }


}