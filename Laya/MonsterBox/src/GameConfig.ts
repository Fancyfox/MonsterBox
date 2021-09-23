/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import GamePage from "./script/Pages/GamePage"
import LoadingPage from "./script/Pages/LoadingPage"
import Loading from "./script/UI/Loading"
import MainUI from "./script/UI/MainUI"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=750;
    static height:number=1334;
    static scaleMode:string="fixedwidth";
    static screenMode:string="none";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="Scenes/Start.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("script/Pages/GamePage.ts",GamePage);
        reg("script/Pages/LoadingPage.ts",LoadingPage);
        reg("script/UI/Loading.ts",Loading);
        reg("script/UI/MainUI.ts",MainUI);
    }
}
GameConfig.init();