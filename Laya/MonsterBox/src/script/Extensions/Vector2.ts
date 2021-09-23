import Vector2 = Laya.Vector2;
import Mathf from "./Mathf";

var zero = new Vector2();

export default (function () {
    Vector2.prototype.vsub = function (v: Laya.Vector2, target?: Laya.Vector2) {
        var self = this as Laya.Vector2;
        var target = target || new Laya.Vector2();
        target.x = self.x - v.x;
        target.y = self.y - v.y;
        return target;
    }

    Vector2.prototype.vadd = function (v: Laya.Vector2, target?: Laya.Vector2) {
        var self = this as Laya.Vector2;
        var target = target || new Laya.Vector2();
        target.x = self.x + v.x;
        target.y = self.y + v.y;
        return target;
    }

    Vector2.prototype.mult = function (n: number, target?: Vector2) {
        var target = target || new Vector2();
        target.x = this.x * n;
        target.y = this.y * n;
        return target;
    }

    Vector2.prototype.divide = function (n: number, target?: Vector2) {
        var target = target || new Vector2();
        target.x = this.x / n;
        target.y = this.y / n;
        return target;
    }

    Vector2.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };

    Vector2.prototype.lerp = function (a: Vector2, t: number, target?: Vector2) {
        t = Mathf.Clamp01(t);
        var target = target || new Laya.Vector2();
        target.x = this.x + ((a.x - this.x) * t);
        target.y = this.y + ((a.y - this.y) * t);
        return target;
    }

    Vector2.prototype.lerpUnclamped = function (a: Vector2, t: number, target?: Vector2) {
        var target = target || new Laya.Vector2();
        target.x = this.x + ((a.x - this.x) * t);
        target.y = this.y + ((a.y - this.y) * t);
        return target;
    }

    Vector2.prototype.magnitude = function () {
        return Mathf.Sqrt((this.x * this.x) + (this.y * this.y));
    }

    Vector2.moveTowards = function (current: Vector2, target: Vector2, maxDistanceDelta: number, out?: Vector2) {
        var out = out || new Vector2();
        var vector = target.vsub(current);
        var magnitude = vector.magnitude();
        if (magnitude <= maxDistanceDelta || magnitude == 0) out.copy(target);
        else {
            current.vadd(vector.divide(magnitude).mult(maxDistanceDelta), out);
        }
        return out;
    }

    Vector2.prototype.normalize = function () {
        let magnitude = this.magnitude();
        if (magnitude <= 1E-05) this.set(0, 0)
        else this.divide(magnitude, this);
        return this;
    }

    Vector2.prototype.magnitudeSquared = function () {
        return this.dot(this);
    };

    Vector2.prototype.unit = Vector2.prototype.normalize;

    Vector2.prototype.distanceTo = function (p: Laya.Vector2) {
        var x = this.x, y = this.y;
        var px = p.x, py = p.y;
        return Math.sqrt((px - x) * (px - x) + (py - y) * (py - y));
    };

    Vector2.prototype.distanceSquared = function (p: Laya.Vector2) {
        var x = this.x, y = this.y;
        var px = p.x, py = p.y;
        return (px - x) * (px - x) + (py - y) * (py - y);
    };

    Vector2.prototype.negate = function (target?: Vector2) {
        target = target || new Laya.Vector2();
        target.x = -this.x;
        target.y = -this.y;
        return target;
    };

    Vector2.prototype.copy = function (v: Laya.Vector2) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    Vector2.prototype.set = function (newX: number, newY: number) {
        this.x = newX;
        this.y = newY;
    };

    Vector2.prototype.toArray = function () {
        return [this.x, this.y];
    }

    Vector2.prototype.fromArray = function (arr: number[]) {
        this.x = arr[0];
        this.y = arr[1];
        this.z = arr[2];
        return this;
    }

    Vector2.prototype.almostEquals = function (v: Laya.Vector2, precision: number) {
        if (precision === undefined) {
            precision = 1e-6;
        }
        if (Math.abs(this.x - v.x) > precision || Math.abs(this.y - v.y) > precision) {
            return false;
        }
        return true;
    };

    Vector2.prototype.isZero = function () {
        return this.x === 0 && this.y === 0;
    };

    Vector2.prototype.min = function (v: Vector2) {
        this.x = Mathf.Min(this.x, v.x);
        this.y = Mathf.Min(this.y, v.y);
        return this;
    }

    Vector2.prototype.max = function (v: Vector2) {
        this.x = Mathf.Max(this.x, v.x);
        this.y = Mathf.Max(this.y, v.y);
        return this;
    }

    Vector2.angle = function (from: Laya.Vector2, to: Laya.Vector2) {
        var num = Mathf.Sqrt(from.magnitudeSquared() * to.magnitudeSquared());
        return num >= 1E-15 ? Mathf.Acos(Mathf.Clamp(from.dot(to) / num, -1, 1)) * 57.29578 : 0;
    }

    Vector2.signedAngle = function (from: Laya.Vector2, to: Laya.Vector2) {
        return Vector2.angle(from, to) * Mathf.Sign(from.x * to.y - from.y * to.x);
    }

    Vector2.reflect = function (inDirection: Vector2, inNormal: Vector2, target?: Vector2) {
        var target = target || new Vector2();
        inNormal.mult(inNormal.dot(inDirection) * -2, target);
        target.vadd(inDirection, target);
        return target;
    }

    Vector2.prototype.toString = function () {
        return 'Vector2: ' + this.x + ", " + this.y;
    };

    Vector2.zero = new Vector2();
    Vector2.one = new Vector2(1, 1);
    Vector2.up = new Vector2(0, 1);
    Vector2.down = new Vector2(0, -1);
    Vector2.right = new Vector2(1, 0);
    Vector2.left = new Vector2(-1, 0);
})();