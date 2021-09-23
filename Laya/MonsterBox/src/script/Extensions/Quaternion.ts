import Quaternion = Laya.Quaternion;
import Mathf from "./Mathf";

export default (function () {
    Quaternion.prototype.vmult = function (v: Laya.Vector3, target?: Laya.Vector3) {
        var target = target || new Laya.Vector3();

        var x = v.x,
            y = v.y,
            z = v.z;

        var qx = this.x,
            qy = this.y,
            qz = this.z,
            qw = this.w;

        // q*v
        var ix = qw * x + qy * z - qz * y,
            iy = qw * y + qz * x - qx * z,
            iz = qw * z + qx * y - qy * x,
            iw = -qx * x - qy * y - qz * z;

        target.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        target.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        target.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return target;
    };

    Quaternion.prototype.conjugate = function () {
        this.x *= - 1;
        this.y *= - 1;
        this.z *= - 1;

        return this;
    }

    Quaternion.prototype.copy = function (s: Laya.Quaternion) {
        this.x = s.x;
        this.y = s.y;
        this.z = s.z;
        this.w = s.w;
        return this;
    }

    Quaternion.prototype.setFromEuler = function (euler: Laya.Vector3) {

        var x = euler.x, y = euler.y, z = euler.z;

        var cos = Math.cos;
        var sin = Math.sin;

        var c1 = cos(x / 2);
        var c2 = cos(y / 2);
        var c3 = cos(z / 2);

        var s1 = sin(x / 2);
        var s2 = sin(y / 2);
        var s3 = sin(z / 2);

        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;

        return this;

    }

    Quaternion.prototype.setFromAxisAngle = function (axis: Laya.Vector3, angle: number) {

        // assumes axis is normalized

        var halfAngle = angle / 2, s = Math.sin(halfAngle);

        this.x = axis.x * s;
        this.y = axis.y * s;
        this.z = axis.z * s;
        this.w = Math.cos(halfAngle);

        return this;

    }

    Quaternion.prototype.setFromRotationMatrix = function (m: Laya.Matrix4x4) {

        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        var te = m.elements,

            m11 = te[0], m12 = te[4], m13 = te[8],
            m21 = te[1], m22 = te[5], m23 = te[9],
            m31 = te[2], m32 = te[6], m33 = te[10],

            trace = m11 + m22 + m33,
            s;

        if (trace > 0) {

            s = 0.5 / Math.sqrt(trace + 1.0);

            this.w = 0.25 / s;
            this.x = (m32 - m23) * s;
            this.y = (m13 - m31) * s;
            this.z = (m21 - m12) * s;

        } else if (m11 > m22 && m11 > m33) {

            s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

            this.w = (m32 - m23) / s;
            this.x = 0.25 * s;
            this.y = (m12 + m21) / s;
            this.z = (m13 + m31) / s;

        } else if (m22 > m33) {

            s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

            this.w = (m13 - m31) / s;
            this.x = (m12 + m21) / s;
            this.y = 0.25 * s;
            this.z = (m23 + m32) / s;

        } else {

            s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

            this.w = (m21 - m12) / s;
            this.x = (m13 + m31) / s;
            this.y = (m23 + m32) / s;
            this.z = 0.25 * s;

        }

        return this;

    }

    Quaternion.prototype.setFromUnitVectors = function (vFrom: Laya.Vector3, vTo: Laya.Vector3) {

        // assumes direction vectors vFrom and vTo are normalized

        var EPS = 0.000001;

        var r = vFrom.dot(vTo) + 1;

        if (r < EPS) {

            r = 0;

            if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {

                this.x = - vFrom.y;
                this.y = vFrom.x;
                this.z = 0;
                this.w = r;

            } else {

                this.x = 0;
                this.y = - vFrom.z;
                this.z = vFrom.y;
                this.w = r;

            }

        } else {

            // crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3

            this.x = vFrom.y * vTo.z - vFrom.z * vTo.y;
            this.y = vFrom.z * vTo.x - vFrom.x * vTo.z;
            this.z = vFrom.x * vTo.y - vFrom.y * vTo.x;
            this.w = r;

        }

        return this.normalize();

    }

    Quaternion.prototype.angleTo = function (q: Quaternion) {
        return 2 * Math.acos(Math.abs(Mathf.Clamp(this.dot(q), - 1, 1)));
    }

    Quaternion.prototype.rotateTowards = function (q: Quaternion, step: number) {

        var angle = this.angleTo(q);

        if (angle === 0) return this;

        var t = Math.min(1, step / angle);

        this.slerp(q, t);

        return this;

    }

    Quaternion.prototype.inverse = function () {
        // quaternion is assumed to have unit length
        return this.conjugate();
    }

    Quaternion.prototype.dot = function (v: Quaternion) {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }

    Quaternion.prototype.lengthSq = function () {
        return this.dot(this);
    }

    Quaternion.prototype.length = function () {
        return Math.sqrt(this.dot(this));
    }

    Quaternion.prototype.normalize = function () {

        var l = this.length();

        if (l === 0) {

            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;

        } else {

            l = 1 / l;

            this.x = this.x * l;
            this.y = this.y * l;
            this.z = this.z * l;
            this.w = this.w * l;

        }

        return this;

    }

    Quaternion.prototype.multiply = function (q: Quaternion) {
        return this.multiplyQuaternions(this, q);
    }

    Quaternion.prototype.premultiply = function (q: Quaternion) {
        return this.multiplyQuaternions(q, this);
    }

    Quaternion.prototype.multiplyQuaternions = function (a: Quaternion, b: Quaternion) {

        var qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
        var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

        this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

        return this;

    }

    Quaternion.prototype.slerp = function (qb: Quaternion, t: number) {

        if (t === 0) return this;
        if (t === 1) return this.copy(qb);

        var x = this.x, y = this.y, z = this.z, w = this.w;

        var cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;

        if (cosHalfTheta < 0) {

            this.w = - qb.w;
            this.x = - qb.x;
            this.y = - qb.y;
            this.z = - qb.z;

            cosHalfTheta = - cosHalfTheta;

        } else {

            this.copy(qb);

        }

        if (cosHalfTheta >= 1.0) {

            this.w = w;
            this.x = x;
            this.y = y;
            this.z = z;

            return this;

        }

        var sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

        if (sqrSinHalfTheta <= Number.EPSILON) {

            var s = 1 - t;
            this.w = s * w + t * this.w;
            this.x = s * x + t * this.x;
            this.y = s * y + t * this.y;
            this.z = s * z + t * this.z;

            this.normalize();

            return this;

        }

        var sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
            ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

        this.w = (w * ratioA + this.w * ratioB);
        this.x = (x * ratioA + this.x * ratioB);
        this.y = (y * ratioA + this.y * ratioB);
        this.z = (z * ratioA + this.z * ratioB);

        return this;
    }

    Quaternion.prototype.equals = function (quaternion: Quaternion) {
        return (quaternion.x === this.x) && (quaternion.y === this.y) && (quaternion.z === this.z) && (quaternion.w === this.w);
    }

    Quaternion.prototype.fromArray = function (arr: number[]) {
        this.x = arr[0];
        this.y = arr[1];
        this.z = arr[2];
        this.w = arr[3];
        return this;
    }

    Quaternion.prototype.toArray = function () {
        return [this.x, this.y, this.z, this.w];
    }

    Quaternion.prototype.toString = function () {
        return 'Quaternion: ' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w;
    }
})();