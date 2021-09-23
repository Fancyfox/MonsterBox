import Vector3 = Laya.Vector3;
import Vector4 = Laya.Vector4;

export default (function () {
    Laya.Color.prototype.toVector3 = function (target: Vector3) {
        let self = this as Laya.Color;
        target = target || new Vector3();
        target.x = self.r;
        target.y = self.g;
        target.z = self.b;
        return target;
    }

    Laya.Color.prototype.toVector4 = function (target: Vector4) {
        let self = this as Laya.Color;
        target = target || new Vector4();
        target.x = self.r;
        target.y = self.g;
        target.z = self.b;
        target.w = self.a;
        return target;
    }
})();