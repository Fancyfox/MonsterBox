import { Configuration } from "../../Data/Configuration";
import { Constants } from "../../Data/Constants";
import { SdkUitl } from "../../Util/SdkUitl";


export interface IAudioInfo {
    musicMute: boolean,
    effectMute: boolean,
    musicVolume: number,
    effectVolume: number,
    vibrate: boolean
}

export default class AudioManager {
    static _instance: AudioManager = null;
    public static instance() {
        if (!this._instance) {
            this._instance = new AudioManager();
        }

        return this._instance;
    }
    public audioInfo: IAudioInfo = null;




    public getAudioData() {
        return this.audioInfo;
    }

    public loadFromCache() {
        const audioInfo = Configuration.instance().getConfigData(Constants.AudioConfigID);
        if (audioInfo) {
            this.audioInfo = JSON.parse(audioInfo);
        } else {
            this._generateAudio();
        }

    }

    public saveAudioInfoToCache() {
        const data = JSON.stringify(this.audioInfo);
        Configuration.instance().setConfigData(Constants.AudioConfigID, data);
    }

    private _generateAudio() {
        this.audioInfo = {
            musicMute: false,
            effectMute: false,
            musicVolume: 0.5,
            effectVolume: 0.5,
            vibrate: true
        }
        this.saveAudioInfoToCache();
    }

    public playMusic(name: string) {
        if (this.audioInfo && !this.audioInfo.musicMute) {
            SdkUitl.playMusic(name, true);
        }

    }

    public resumeMusic() {
        if (this.audioInfo && !this.audioInfo.musicMute) {
            // if (!cc.audioEngine.isMusicPlaying()) {
            //     cc.audioEngine.resumeMusic();
            // }
        }
    }

    public pasueMusic() {
        if (this.audioInfo && !this.audioInfo.musicMute) {
            // if (cc.audioEngine.isMusicPlaying()) {
            //     cc.audioEngine.pauseMusic();
            // }
        }
    }

    public stopMusic() {


    }

    public setVibrate(vibrate: boolean) {
        if (this.audioInfo.vibrate = vibrate) {
            return;
        }
        this.audioInfo.vibrate = vibrate;
        this.saveAudioInfoToCache();
    }

    public getVibrate() {
        return this.audioInfo.vibrate;
    }

    public setMusicVolume(volume: number) {


    }

    public playEffect(name: string) {
        if (this.audioInfo && !this.audioInfo.effectMute) {
            const path = `subPackage/sub2/Audio/Effect/${name}.mp3`;
            Laya.SoundManager.playSound(path);
        }
    }

    public setAudioMute(mute: boolean) {
        if (this.audioInfo.effectMute == mute) {
            return;
        }
        this.audioInfo.effectMute = mute;
        this.audioInfo.musicMute = mute;
        this.saveAudioInfoToCache();
    }

    public getAudioMute() {
        return this.audioInfo.effectMute;
    }

    public stopAllEffects() {
        //cc.audioEngine.stopAllEffects();
    }

    public setEffectVolume(volume: number) {
        // if (this.audioInfo) {
        //     this.audioInfo.effectVolume = volume;
        //     cc.audioEngine.setEffectsVolume(this.audioInfo.effectVolume);
        // }

    }
}
