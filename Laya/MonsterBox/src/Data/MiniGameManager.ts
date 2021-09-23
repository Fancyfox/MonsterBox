import EventManager from "../script/Singleton/EventManager";
import GameData from "../script/Singleton/GameData";
import GameDefine, { CharacterState, EventName, GameState } from "../script/Singleton/GameDefine";
import { Configuration } from "./Configuration";
import { Constants } from "./Constants"


export class MiniGameManager {
    static _instance: MiniGameManager = null;
    private _level: number = 1;
    public static instance() {
        if (!this._instance) {
            this._instance = new MiniGameManager();
        }

        return this._instance;
    }

    public loadLevelFromCache() {
        const levelTick = Configuration.instance().getConfigData(Constants.LevelTick);
        if (levelTick) {
            this._level = Number(JSON.parse(levelTick));
        }
    }

    public _saveLevelToCache() {
        const data = JSON.stringify(this._level);
        Configuration.instance().setConfigData(Constants.LevelTick, data);
    }

    public nextLevel() {
        this._level++;
        this._saveLevelToCache();
        EventManager.dispatchEvent(EventName.NEXT_LEVEL, this._level);
    }

    public getSceneLevel() {
        return this._level;
    }


    public StartGame() {
        GameDefine.gameState = GameState.Playing;
        EventManager.dispatchEvent(EventName.MINI_GAME_START)
    }

    public EndGame() {
        GameDefine.gameState = GameState.End;
        EventManager.dispatchEvent(EventName.MINI_GAME_END)

    }

    public PauseGame() {
        GameDefine.gameState = GameState.Pause;
        EventManager.dispatchEvent(EventName.MINI_GAME_RELIFE);
    }

    public ResumeGame() {
        GameDefine.gameState = GameState.Playing;
    }

    public DieGame() {
        GameDefine.gameState = GameState.Die;
        EventManager.dispatchEvent(EventName.MINI_GAME_DIE);
    }



}