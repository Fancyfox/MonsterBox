import WeChatManager from "../../Util/WeChatManager";
import GameDefine from "./GameDefine";


export default class SoundUtil {
    private static _instance: SoundUtil;
    public static get instance() {
        if (!this._instance) this._instance = new SoundUtil();
        return this._instance;
    }

    //private bgmPlaying = false;
    /**音效是否静音 */
    public static isMute=false;
    /**背景音乐是否静音 */
    public static isBgmMute=false;

    // 播放背景音乐
    public playBgm(): void {
        if(SoundUtil.isBgmMute) return;
        if ( GameDefine.bgms.length === 0) return;
       // this.bgmPlaying = true;
        let url = GameDefine.soundPath + GameDefine.bgms[Math.floor(Math.random() * GameDefine.bgms.length)];
        if(Laya.Browser.onWeiXin){
            WeChatManager.BGM_PLAY(url)
        }else{
            Laya.SoundManager.playMusic(url, 0);
        }
        
    }

    // 停止背景音乐
    public stopBgm(): void {
        if(SoundUtil.isBgmMute) return;
       // if (!this.bgmPlaying) return;
        if(Laya.Browser.onWeiXin){
             WeChatManager.BGM_Stop();
        }else{
            Laya.SoundManager.stopMusic(); 
        }
        
    }

    // 播放音效
    public playSound(name: string, loop: number = 1): void {
        if(SoundUtil.isMute) return;
        Laya.SoundManager.playSound(GameDefine.soundPath + name+".mp3", loop);
    }

    // 停止音效
    public stopSound(name: string): void {
        if(SoundUtil.isMute) return;
        Laya.SoundManager.stopSound(GameDefine.soundPath + name+".mp3");
    }
}