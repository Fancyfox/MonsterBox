window.flyCoin = {
    nodePool: [],
    coinPfb: null,

    //num金币数量  loop 循环次数 delay 间隔时间 starPoi 起始点 endPoi 金币飞的终点 cb 回调  pNode 所加载到的节点（cc.Canvas.instance.node）
    createMultiplyCoinFly: function (num, loop, delay, starPoi, endPoi, cb, pNode) {
        this.pNode = pNode;
        var callBack = () => {
            pNode.runAction(
                cc.repeat(
                    cc.sequence(
                        cc.callFunc(() => {
                            this.createFlyCoin(num, starPoi, endPoi, () => {
                                cb && cb()
                            })
                        }, this),
                        cc.delayTime(delay)),
                    loop
                )
            )
        }
        if (!this.coinPfb || this.coinPfb == null) {
            cc.loader.loadRes("flyCoin/flycoin", cc.Prefab, (err, prefab) => {
                if (!err) this.coinPfb = prefab, callBack && callBack();
                else console.log(err)
            });
        } else callBack && callBack();
    },

    createFlyCoin: function (num, starPoi, endPoi, cb) {
        let self=this;
        var callBack = (step) => {

            var dt = cc.misc.degreesToRadians((400/num) * step),
                dx = starPoi.x + 200 * Math.cos(dt),
                dy = starPoi.y + 200 * Math.sin(dt),
                coinNode = this.getCoin();
            this.pNode.addChild(coinNode)
            coinNode.position = starPoi;
            var anim = coinNode.getComponent(cc.Animation);
            anim.play("flycoin")
            coinNode.stopAllActions()

            coinNode.scale = 0.6;
            var time1 = this.getRandom(0.4, 0.6) / 1.5,
                time2 = this.getRandom(0.89, 1) / 1.5;

            coinNode.runAction(
                cc.sequence(
                    cc.moveTo(time1, cc.v2(dx, dy)),
                    cc.moveTo(time2, endPoi).easing(cc.easeIn(2)),
                    cc.callFunc(() => {
                        anim.setCurrentTime(0.5);
                        anim.stop("flycoin");
                        step === num - 1 && cb && cb();
                    }),
                    cc.repeat(cc.sequence(cc.scaleTo(.05, .9), cc.scaleTo(.05, .6)), 1),
                    cc.callFunc(() => {
                        this.putCoin(coinNode)
                    })
                )
            )
        }
        for (let i = 0; i < num; i++) callBack(i)
    },
    getRandom: function (e, t) {
        return e + (t - e) * Math.random()
    },
    getCoin() {
        var obj = null;
        if (this.nodePool.length > 0) {
            obj = this.nodePool.pop();
        } else {
            obj = cc.instantiate(this.coinPfb);
        }
        return obj
    },
    putCoin(obj) {
        obj.stopAllActions();
        obj.removeFromParent();
        this.nodePool.push(obj);
    },
}