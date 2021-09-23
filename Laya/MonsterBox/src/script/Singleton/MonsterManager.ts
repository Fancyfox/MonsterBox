interface IMonsterInfo{
    name:MonsterName,
    speed:number, //速度
    hp:number, //血量
    attack:number, //攻击力
    type:MonsterType //属性
}

export enum MonsterName{
    Monster0 = "Monster0",
    Monster1 = "Monster1",
    Monster2 = "Monster2",
    Monster3 = "Monster3",
    Monster4 = "Monster4",
    Monster5 = "Monster5",
    Monster6 = "Monster6",
    Monster7 = "Monster7",
    Monster8 = "Monster8",
    Monster9 = "Monster9",
}

//属性
enum MonsterType  {
    Fire = 1, //火系
    Water,   //水系
    Grass,   //草系
    Electric, //电系
    Ground  //地面系
}

export default class MonsterManager{
    static _instance: MonsterManager = null;
    public static instance() {
        if (!this._instance) {
            this._instance = new MonsterManager();
        }

        return this._instance;
    }
}