export default (function () {
    var tmpQuat = new Laya.Quaternion();

    Laya.Transform3D.pointToLocalFrame = function (position: Laya.Vector3, quaternion: Laya.Quaternion, worldPoint: Laya.Vector3, result?: Laya.Vector3) {
        var result = result || new Laya.Vector3();
        worldPoint.vsub(position, result);
        quaternion.conjugate(tmpQuat);
        tmpQuat.vmult(result, result);
        return result;
    }

    Laya.Transform3D.prototype.pointToLocalFrame = function (worldPoint: Laya.Vector3, result?: Laya.Vector3) {
        return Laya.Transform3D.pointToLocalFrame(this.position, this.rotation, worldPoint, result);
    }

    Laya.Transform3D.pointToWorldFrame = function (position: Laya.Vector3, quaternion: Laya.Quaternion, localPoint: Laya.Vector3, result?: Laya.Vector3) {
        var result = result || new Laya.Vector3();
        quaternion.vmult(localPoint, result);
        result.vadd(position, result);
        return result;
    }

    Laya.Transform3D.prototype.pointToWorldFrame = function (localPoint: Laya.Vector3, result?: Laya.Vector3) {
        return Laya.Transform3D.pointToWorldFrame(this.position, this.rotation, localPoint, result);
    }

    Laya.Transform3D.vectorToWorldFrame = function (quaternion: Laya.Quaternion, localVector: Laya.Vector3, result?: Laya.Vector3) {
        var result = result || new Laya.Vector3();
        quaternion.vmult(localVector, result);
        return result;
    }

    Laya.Transform3D.prototype.vectorToWorldFrame = function (localVector: Laya.Vector3, result?: Laya.Vector3) {
        return Laya.Transform3D.vectorToWorldFrame(this.rotation, localVector, result);
    }

    Laya.Transform3D.vectorToLocalFrame = function (quaternion: Laya.Quaternion, worldVector: Laya.Vector3, result?: Laya.Vector3) {
        var result = result || new Laya.Vector3();
        quaternion.w *= -1;
        quaternion.vmult(worldVector, result);
        quaternion.w *= -1;
        return result;
    }

    Laya.Transform3D.prototype.vectorToLocalFrame = function (worldVector: Laya.Vector3, result?: Laya.Vector3) {
        return Laya.Transform3D.vectorToLocalFrame(this.rotation, worldVector, result);
    }
})();