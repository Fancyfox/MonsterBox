function traverse(node: Laya.Node, callback: Laya.Handler) {
    callback.runWith(node);
    if (node.numChildren > 0)
        for (let i = 0; i < node.numChildren; i++) traverse(node.getChildAt(i), callback);
}

export default (function () {
    Laya.Node.prototype.find = function (path: string) {
        let self: Laya.Node = this;
        if (!path) return self;
        let arr = path.split('/');
        let cur: Laya.Node = self;
        while (arr.length > 0) {
            cur = cur.getChildByName(arr.shift());
            if (!cur) return null;
        }
        return cur;
    }

    Laya.Node.prototype.findChild = function (name: string) {
        let self = this as Laya.Node;
        for (let i = 0; i < self.numChildren; i++) {
            let n = self.getChildAt(i);
            if (n.name === name) return n;
            else {
                if (n.numChildren > 0) {
                    let ret = n.findChild(name);
                    if (ret.name === name) return ret;
                }
            }
        }
    }

    Laya.Node.prototype.traverse = function (call: Function) {
        let h = new Laya.Handler(Laya.Node.prototype, call);
        traverse(this, h);
        h.recover();
    }
})();