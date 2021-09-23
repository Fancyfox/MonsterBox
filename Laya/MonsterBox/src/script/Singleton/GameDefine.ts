export enum GameState {
    None,
    Ready,
    PreviewMap,
    Playing,
    Pause,
    Die,
    End
}

export enum CharacterState {
    None,
    Idle,
    Run,
    Die,
    Win
}

export enum CharacterAnimation {
    Idel = "idle",
    Running = "running",
    Falling = "falling",
    Escalade = "escalade",
    Back = "back",
    Carrying = "carrying",
    Jump = "jump",
    Planche = "planche",
    Defeated = "defeated",
    Dance = "dance",
    BigJump = "bigJump"
}



export enum EventName {
    SCENE_CLEAR = 'scene-clear',

    MINI_GAME_START = 'mini-game-start',
    MINI_GAME_END = 'mini-game-end',
    MINI_GAME_DIE = 'mini-game-die',
    MINI_GAME_RELIFE = 'mini-game-relife',

    PLAYER_RELIFE = 'player-relife',
    ADD_MOENY = 'add-money',
    REDUCE_MOENY = 'reduce-money',
    ADD_SCORE = 'add-score',

    ADD_PLANK = 'add-plank',



    SHOP_PLANK_CHOOSE = 'shop_plank_choose',
    SHOP_PLANK_BUY = 'shio_plank_buy',

    NEXT_LEVEL = 'next-level',

    PLAYER_PLANK_CHANGE = 'player-plank-change'
}


export default class GameDefine {
    /**最大关卡数 */
    public static maxLevel: number = 4;
    public static prefabRoot: string = 'subPackage/sub1/LayaScene_main/Conventional/';
    public static levelRoot: string = 'subPackage/sub1/remote/levels/'
    public static scenePath: string = "subPackage/sub1/LayaScene_main/Conventional/main.ls";
    
    public static soundPath: string = 'subPackage/LayaScene_main/sounds/';

    
    public static dataPath: string = "data/";
    public static preload = [
        "Plane.lh",
        "Egg.lh",
        "pCylinder1.lh",
        "CaptureCube.lh",
        "Rock_01.lh",
        "Rock_04.lh",
        "Monster0.lh",
        "Monster1.lh",
        "Monster2.lh",
        "Monster3.lh",
        "Monster4.lh",
        "Monster5.lh",
        "Monster6.lh",
        "Monster7.lh",
        "Monster8.lh",
        "Monster9.lh",

    ]

    public static sounds = [

    ]





    public static bgms = [
        "bgm.mp3"
    ]


    public static gameState: GameState = GameState.None;
    public static playerState: CharacterState = CharacterState.None;
    public static CollisionGroup_Obs: number = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3;
}