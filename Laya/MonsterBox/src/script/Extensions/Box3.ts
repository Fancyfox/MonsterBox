import Vector3 = Laya.Vector3;

var _points = [
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3(),
    new Vector3()
];

var _vector = new Vector3();

// triangle centered vertices

var _v0 = new Vector3();
var _v1 = new Vector3();
var _v2 = new Vector3();

var _box;

// triangle edge vectors

var _f0 = new Vector3();
var _f1 = new Vector3();
var _f2 = new Vector3();

var _center = new Vector3();
var _extents = new Vector3();
var _triangleNormal = new Vector3();
var _testAxis = new Vector3();

export default class Box3 {
    public min: Vector3;
    public max: Vector3;

    constructor(min?: Vector3, max?: Vector3) {
        this.min = (min !== undefined) ? min : new Vector3(+ Infinity, + Infinity, + Infinity);
        this.max = (max !== undefined) ? max : new Vector3(- Infinity, - Infinity, - Infinity);
    }

    set(min: Vector3, max: Vector3) {
        this.min.copy(min);
        this.max.copy(max);
        return this;
    }

    setFromArray(array: number[]) {

        var minX = + Infinity;
        var minY = + Infinity;
        var minZ = + Infinity;

        var maxX = - Infinity;
        var maxY = - Infinity;
        var maxZ = - Infinity;

        for (var i = 0, l = array.length; i < l; i += 3) {

            var x = array[i];
            var y = array[i + 1];
            var z = array[i + 2];

            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (z < minZ) minZ = z;

            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
            if (z > maxZ) maxZ = z;

        }

        this.min.set(minX, minY, minZ);
        this.max.set(maxX, maxY, maxZ);

        return this;
    }

    setFromPoints(points: Vector3[]) {
        this.makeEmpty();
        for (var i = 0, il = points.length; i < il; i++) {
            this.expandByPoint(points[i]);
        }
        return this;
    }

    setFromCenterAndSize(center: Vector3, size: Vector3) {
        var halfSize = _vector.copy(size).mult(0.5);
        this.min.copy(center).vsub(halfSize, this.min);
        this.max.copy(center).vadd(halfSize, this.max);
        return this;
    }

    setFromObject(object: Laya.Sprite3D) {
        this.makeEmpty();
        return this.expandByObject(object);

    }

    copy(box: Box3) {
        this.min.copy(box.min);
        this.max.copy(box.max);
        return this;
    }

    clone() {
        return new Box3().copy(this);
    }

    makeEmpty() {
        this.min.x = this.min.y = this.min.z = + Infinity;
        this.max.x = this.max.y = this.max.z = - Infinity;
        return this;
    }

    isEmpty() {
        return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
    }

    getCenter(target?: Vector3) {
        var target = target || new Vector3();
        if (this.isEmpty()) target.set(0, 0, 0);
        else {
            this.min.vadd(this.max, target);
            target.mult(0.5, target);
        }
        return target;
    }

    getSize(target?: Vector3) {
        var target = target || new Vector3();
        if (this.isEmpty()) target.set(0, 0, 0);
        else {
            this.max.vsub(this.min, target);
        }
        return target;
    }

    expandByPoint(point: Vector3) {
        this.min.min(point);
        this.max.max(point);
        return this;
    }

    expandByVector(vector: Vector3) {
        this.min.vsub(vector, this.min);
        this.max.vadd(vector, this.max);
        return this;
    }

    expandByScalar(scalar: number) {
        this.min.x -= scalar;
        this.min.y -= scalar;
        this.min.z -= scalar;
        this.max.x += scalar;
        this.max.y += scalar;
        this.max.z += scalar;
        return this;

    }

    expandByObject(object: Laya.Sprite3D) {
        if (object instanceof Laya.MeshSprite3D) {
            let m = object as Laya.MeshSprite3D;
            m.meshFilter.sharedMesh.calculateBounds();

            if (!_box) _box = new Box3();

            _box.set(m.meshFilter.sharedMesh.bounds.getMin(), m.meshFilter.sharedMesh.bounds.getMax());
            _box.applyMatrix4(object.transform.worldMatrix);

            this.union(_box);

        }
        var children=[];
         for(let i=0;i<object.numChildren;i++){
             children.push(object.getChildAt(i)as Laya.Sprite3D);
         }
       for (var i = 0, l = children.length; i < l; i++) {

            this.expandByObject(children[i] as Laya.Sprite3D);

        }

        return this;
    }

    containsPoint(point: Vector3) {
        return point.x < this.min.x || point.x > this.max.x ||
            point.y < this.min.y || point.y > this.max.y ||
            point.z < this.min.z || point.z > this.max.z ? false : true;
    }

    containsBox(box: Box3) {
        return this.min.x <= box.min.x && box.max.x <= this.max.x &&
            this.min.y <= box.min.y && box.max.y <= this.max.y &&
            this.min.z <= box.min.z && box.max.z <= this.max.z;
    }

    getParameter(point: Vector3, target?: Vector3) {

        var target = target || new Vector3();

        target.set(
            (point.x - this.min.x) / (this.max.x - this.min.x),
            (point.y - this.min.y) / (this.max.y - this.min.y),
            (point.z - this.min.z) / (this.max.z - this.min.z)
        );

        return target;
    }

    intersectsBox(box: Box3) {
        return box.max.x < this.min.x || box.min.x > this.max.x ||
            box.max.y < this.min.y || box.min.y > this.max.y ||
            box.max.z < this.min.z || box.min.z > this.max.z ? false : true;
    }

    applyMatrix4(matrix: Laya.Matrix4x4) {
        if (this.isEmpty()) return this;

        _points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix); // 000
        _points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix); // 001
        _points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix); // 010
        _points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix); // 011
        _points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix); // 100
        _points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix); // 101
        _points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix); // 110
        _points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix); // 111

        this.setFromPoints(_points);

        return this;
    }

    union(box: Box3) {
        this.min = this.min.min(box.min);
        this.max = this.max.max(box.max);
        return this;
    }

    intersect(box: Box3) {
        this.min.max(box.min);
        this.max.min(box.max);
        if (this.isEmpty()) this.makeEmpty();
        return this;
    }
}