import Mathf from "./Mathf";

export default (function () {
    Laya.Vector3.prototype.vsub = function (v: Laya.Vector3, target?: Laya.Vector3) {
        var target = target || new Laya.Vector3();
        Laya.Vector3.subtract(this, v, target);
        return target;
    }

    Laya.Vector3.prototype.vadd = function (v: Laya.Vector3, target?: Laya.Vector3) {
        var target = target || new Laya.Vector3();
        Laya.Vector3.add(this, v, target);
        return target;
    }

    Laya.Vector3.prototype.mult = function (scalar, target) {
        target = target || new Laya.Vector3();
        var x = this.x,
            y = this.y,
            z = this.z;
        target.x = scalar * x;
        target.y = scalar * y;
        target.z = scalar * z;
        return target;
    };

    Laya.Vector3.prototype.divide = function (scalar, target) {
        target = target || new Laya.Vector3();
        var x = this.x,
            y = this.y,
            z = this.z;
        target.x = x / scalar;
        target.y = y / scalar;
        target.z = z / scalar;
        return target;
    };

    Laya.Vector3.prototype.cross = function (v: Laya.Vector3, target?: Laya.Vector3) {
        var vx = v.x, vy = v.y, vz = v.z, x = this.x, y = this.y, z = this.z;
        var target = target || new Laya.Vector3();

        target.x = (y * vz) - (z * vy);
        target.y = (z * vx) - (x * vz);
        target.z = (x * vy) - (y * vx);

        return target;
    };

    Laya.Vector3.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    };

    Laya.Vector3.prototype.normalize = function () {
        var num = this.magnitude();
        if (num <= 1E-05) this.set(0, 0, 0)
        else this.divide(num, this);
        return this;
    };

    Laya.Vector3.prototype.magnitude = function () {
        return Mathf.Sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };

    Laya.Vector3.prototype.magnitudeSquared = function () {
        return this.dot(this);
    }

    Laya.Vector3.prototype.distanceTo = function (p: Laya.Vector3) {
        var x = this.x, y = this.y, z = this.z;
        var px = p.x, py = p.y, pz = p.z;
        return Math.sqrt((px - x) * (px - x) +
            (py - y) * (py - y) +
            (pz - z) * (pz - z));
    };

    Laya.Vector3.prototype.distanceSquared = function (p: Laya.Vector3) {
        var x = this.x, y = this.y, z = this.z;
        var px = p.x, py = p.y, pz = p.z;
        return (px - x) * (px - x) + (py - y) * (py - y) + (pz - z) * (pz - z);
    };

    Laya.Vector3.prototype.scale = Laya.Vector3.prototype.mult;

    Laya.Vector3.prototype.vmul = function (vector, target) {
        target = target || new Laya.Vector3();
        target.x = vector.x * this.x;
        target.y = vector.y * this.y;
        target.z = vector.z * this.z;
        return target;
    };

    Laya.Vector3.prototype.negate = function (target) {
        target = target || new Laya.Vector3();
        target.x = -this.x;
        target.y = -this.y;
        target.z = -this.z;
        return target;
    };

    Laya.Vector3.prototype.set = function (x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    Laya.Vector3.prototype.copy = function (v: Laya.Vector3) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    Laya.Vector3.prototype.toArray = function () {
        return [this.x, this.y, this.z];
    }

    Laya.Vector3.prototype.fromArray = function (array: number[], offset?: number) {
        if (offset === undefined) offset = 0;
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        return this;
    }

    var Vec3_tangents_n = new Laya.Vector3();
    var Vec3_tangents_randVec = new Laya.Vector3();
    Laya.Vector3.prototype.tangents = function (t1, t2) {
        var norm = this.norm();
        if (norm > 0.0) {
            var n = Vec3_tangents_n;
            var inorm = 1 / norm;
            n.set(this.x * inorm, this.y * inorm, this.z * inorm);
            var randVec = Vec3_tangents_randVec;
            if (Math.abs(n.x) < 0.9) {
                randVec.set(1, 0, 0);
                n.cross(randVec, t1);
            } else {
                randVec.set(0, 1, 0);
                n.cross(randVec, t1);
            }
            n.cross(t1, t2);
        } else {
            // The normal length is zero, make something up
            t1.set(1, 0, 0);
            t2.set(0, 1, 0);
        }
    };

    Laya.Vector3.prototype.lerp = function (v: Laya.Vector3, t: number, target: Laya.Vector3) {
        var x = this.x, y = this.y, z = this.z;
        target.x = x + (v.x - x) * t;
        target.y = y + (v.y - y) * t;
        target.z = z + (v.z - z) * t;
    };

    Laya.Vector3.prototype.almostEquals = function (v: Laya.Vector3, precision: number) {
        if (precision === undefined) {
            precision = 1e-6;
        }
        if (Math.abs(this.x - v.x) > precision ||
            Math.abs(this.y - v.y) > precision ||
            Math.abs(this.z - v.z) > precision) {
            return false;
        }
        return true;
    };

    Laya.Vector3.prototype.isZero = function () {
        return this.x === 0 && this.y === 0 && this.z === 0;
    };

    var antip_neg = new Laya.Vector3();
    Laya.Vector3.prototype.isAntiparallelTo = function (v: Laya.Vector3, precision: number) {
        this.negate(antip_neg);
        return antip_neg.almostEquals(v, precision);
    };

    Laya.Vector3.angle = function (from: Laya.Vector3, to: Laya.Vector3) {
        var num = Mathf.Sqrt(from.magnitudeSquared() * to.magnitudeSquared());
        // var num = from.distanceTo(to);
        return num >= 1E-15 ? Mathf.Acos(Mathf.Clamp(from.dot(to) / num, -1, 1)) * 57.29578 : 0;
    }

    Laya.Vector3.signedAngle = function (from: Laya.Vector3, to: Laya.Vector3, axis: Laya.Vector3) {
        return Laya.Vector3.angle(from, to) * Mathf.Sign(axis.dot(from.cross(to)));
    }

    Laya.Vector3.moveTowards = function (current: Laya.Vector3, target: Laya.Vector3, maxDistanceDelta: number, out?: Laya.Vector3) {
        var out = out || new Laya.Vector3();
        var vector = target.vsub(current);
        var magnitude = vector.magnitude();
        if (magnitude <= maxDistanceDelta || magnitude == 0) out.copy(target);
        else {
            current.vadd(vector.divide(magnitude).mult(maxDistanceDelta), out);
        }
        return out;
    }

    Laya.Vector3.reflect = function (inDirection: Laya.Vector3, inNormal: Laya.Vector3, target?: Laya.Vector3) {
        var target = target || new Laya.Vector3();
        inNormal.mult(inNormal.dot(inDirection) * -2, target);
        target.vadd(inDirection, target);
        return target;
    }

    Laya.Vector3.prototype.min = function (v: Laya.Vector3) {
        this.x = Mathf.Min(this.x, v.x);
        this.y = Mathf.Min(this.y, v.y);
        this.z = Mathf.Min(this.z, v.z);
        return this;
    }

    Laya.Vector3.prototype.max = function (v: Laya.Vector3) {
        this.x = Mathf.Max(this.x, v.x);
        this.y = Mathf.Max(this.y, v.y);
        this.z = Mathf.Max(this.z, v.z);
        return this;
    }

    Laya.Vector3.prototype.applyMatrix3 = function (m: Laya.Matrix3x3) {
        var x = this.x, y = this.y, z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[3] * y + e[6] * z;
        this.y = e[1] * x + e[4] * y + e[7] * z;
        this.z = e[2] * x + e[5] * y + e[8] * z;
        return this;
    }

    Laya.Vector3.prototype.applyMatrix4 = function (m: Laya.Matrix4x4) {
        var x = this.x, y = this.y, z = this.z;
        var e = m.elements;
        var w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
        return this;
    }

    Laya.Vector3.prototype.applyQuaternion = function (q: Laya.Quaternion) {
        var x = this.x, y = this.y, z = this.z;
        var qx = q.x, qy = q.y, qz = q.z, qw = q.w;
        // calculate quat * vector
        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = - qx * x - qy * y - qz * z;
        // calculate result * inverse quat
        this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
        this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
        this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;
        return this;
    }

    Laya.Vector3.prototype.setFromMatrixPosition = function (m: Laya.Matrix4x4) {
        var e = m.elements;
        this.x = e[12];
        this.y = e[13];
        this.z = e[14];
        return this;
    }

    Laya.Vector3.prototype.setFromMatrixScale = function (m: Laya.Matrix4x4) {
        var sx = this.setFromMatrixColumn(m, 0).magnitude();
        var sy = this.setFromMatrixColumn(m, 1).magnitude();
        var sz = this.setFromMatrixColumn(m, 2).magnitude();
        this.x = sx;
        this.y = sy;
        this.z = sz;
        return this;
    }

    Laya.Vector3.prototype.setFromMatrix3Column = function (m: Laya.Matrix4x4, index: number) {
        return this.fromArray(m.elements, index * 3);
    }

    Laya.Vector3.prototype.setFromMatrixColumn = function (m: Laya.Matrix4x4, index: number) {
        return this.fromArray(m.elements, index * 4);
    }

    Laya.Vector3.prototype.toString = function () {
        return 'Vector3: ' + this.x + ", " + this.y + ", " + this.z;
    };

    Laya.Vector3.zero = new Laya.Vector3();
    Laya.Vector3.one = new Laya.Vector3(1, 1, 1);
    Laya.Vector3.up = new Laya.Vector3(0, 1, 0);
    Laya.Vector3.down = new Laya.Vector3(0, -1, 0);
    Laya.Vector3.forward = new Laya.Vector3(0, 0, 1);
    Laya.Vector3.back = new Laya.Vector3(0, 0, -1);
    Laya.Vector3.right = new Laya.Vector3(-1, 0, 0);
    Laya.Vector3.left = new Laya.Vector3(1, 0, 0);
})();