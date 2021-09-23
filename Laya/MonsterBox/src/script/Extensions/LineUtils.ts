
import Mathf from "../Extensions/Mathf";
//import EasyBezier from "./EaseBezier";

import Box3 from "../Extensions/Box3";

import GameData from "../singleton/GameData";

export default class LineUtils {
    static lines: Laya.PixelLineSprite3D[] = [];

    public static drawLine(start: Laya.Vector3, end: Laya.Vector3, clearDelay: number = 1000, color1?: Laya.Color, color2?: Laya.Color) {
        var color1 = color1 || Laya.Color.RED;
        var color2 = color2 || Laya.Color.GREEN;
        let line = this.getLine();
        line.maxLineCount = 1;
        line.addLine(start, end, color1, color2);
        if (clearDelay !== Infinity) Laya.timer.once(clearDelay, this, this.recycle, [line], false);
        return line;
    }

    // public static drawBezier(bezier: EasyBezier | Laya.Vector3[], clearDelay: number = 1000, color?: Laya.Color, segment?: number) {
    //     let ins: EasyBezier;
    //     if (bezier instanceof EasyBezier) ins = bezier;
    //     else ins = new EasyBezier(bezier);
    //     var segment = segment || 15;
    //     let points: Laya.Vector3[] = [];
    //     for (let i = 0; i <= segment; i++) points.push(ins.getPoint(i / segment));
    //     return this.drawPolyLine(points, clearDelay, color);
    // }

    public static drawPolyLine(points: Laya.Vector3[], clearDelay: number = 1000, color?: Laya.Color) {
        var color = color || Laya.Color.RED;
        let line = this.getLine();
        line.maxLineCount = points.length - 1;
        for (let i = 0, len = points.length - 1; i < len; i++) line.addLine(points[i], points[i + 1], color, color);
        if (clearDelay !== Infinity) Laya.timer.once(clearDelay, this, this.recycle, [line], false);
        return line;
    }

    public static drawBox3(box: Box3, clearDelay: number = 1000, color?: Laya.Color) {
        let p0 = new Laya.Vector3(box.min.x, box.min.y, box.min.z); // 000
        let p1 = new Laya.Vector3(box.min.x, box.min.y, box.max.z); // 001
        let p2 = new Laya.Vector3(box.min.x, box.max.y, box.min.z); // 010
        let p3 = new Laya.Vector3(box.min.x, box.max.y, box.max.z); // 011
        let p4 = new Laya.Vector3(box.max.x, box.min.y, box.min.z); // 100
        let p5 = new Laya.Vector3(box.max.x, box.min.y, box.max.z); // 101
        let p6 = new Laya.Vector3(box.max.x, box.max.y, box.min.z); // 110
        let p7 = new Laya.Vector3(box.max.x, box.max.y, box.max.z); // 111
        let points = [
            p0, p1,
            p1, p3,
            p3, p2,
            p2, p0,
            p4, p5,
            p5, p7,
            p7, p6,
            p6, p4,
            p2, p6,
            p0, p4,
            p3, p7,
            p1, p5,
            p2, p4,
            p3, p5,
            p2, p1,
            p6, p5,
            p2, p7,
            p0, p5,
        ];
        var color = color || Laya.Color.RED;
        let line = this.getLine();
        line.maxLineCount = points.length / 2;

        for (let i = 0; i < points.length; i += 2) line.addLine(points[i], points[i + 1], color, color);
        if (clearDelay !== Infinity) Laya.timer.once(clearDelay, this, this.recycle, [line], false);
        return line;
    }

    public static drawSphere(center: Laya.Vector3, radius: number, clearDelay: number = 1000, color?: Laya.Color, segment?: number) {
        var color = color || Laya.Color.RED;
        let lineNum = segment || 35;
        let points: Laya.Vector3[] = [];
        let line = this.getLine();
        line.maxLineCount = lineNum * 3;

        let pre1: Laya.Vector3;
        let pre2: Laya.Vector3;
        let pre3: Laya.Vector3;

        let q1 = new Laya.Quaternion();
        q1.setFromAxisAngle(Laya.Vector3.right, Mathf.PI * 0.5);

        let q2 = new Laya.Quaternion();
        q2.setFromAxisAngle(Laya.Vector3.up, Mathf.PI * 0.5);

        for (let i = 0; i < lineNum; i++) {
            let rad = i / lineNum * Mathf.PI * 2;
            let x = Mathf.Sin(rad) * radius;
            let y = Mathf.Cos(rad) * radius;
            let p = new Laya.Vector3(x, y, 0);

            let p1 = p.vadd(center);
            points.push(p1);

            if (pre1) {
                line.addLine(pre1, p1, color, color);
                if (i === lineNum - 1) line.addLine(points[0], p1, color, color);
            }

            pre1 = p1;

            let p2 = p.clone() as Laya.Vector3;
            p2.applyQuaternion(q1);
            p2.vadd(center, p2);
            points.push(p2);

            if (pre2) {
                line.addLine(pre2, p2, color, color);
                if (i === lineNum - 1) line.addLine(points[1], p2, color, color);
            }

            pre2 = p2;

            let p3 = p.clone() as Laya.Vector3;
            p3.applyQuaternion(q2);
            p3.vadd(center, p3);
            points.push(p3);

            if (pre3) {
                line.addLine(pre3, p3, color, color);
                if (i === lineNum - 1) line.addLine(points[2], p3, color, color);
            }

            pre3 = p3;
        }
        if (clearDelay !== Infinity) Laya.timer.once(clearDelay, this, this.recycle, [line], false);
        return line;
    }

    public static drawSquare(center: Laya.Vector3, size: Laya.Vector2 | number, axis: Laya.Vector3 = Laya.Vector3.forward, clearDelay: number = 1000, color?: Laya.Color) {
        var color = color || Laya.Color.RED;
        var axis = axis || Laya.Vector3.forward;
        var extent = size instanceof Laya.Vector2 ? size : new Laya.Vector2(size, size);
        var upLeft = Laya.Vector3.left.mult(extent.x * 0.5).vadd(Laya.Vector3.up.mult(extent.y * 0.5));
        var upRight = upLeft.vadd(Laya.Vector3.right.mult(extent.x));
        var lowRight = upRight.vadd(Laya.Vector3.down.mult(extent.y));
        var lowLeft = lowRight.vadd(Laya.Vector3.left.mult(extent.x));
        let q = new Laya.Quaternion();
        q.setFromUnitVectors(Laya.Vector3.forward, axis);
        var arr = [upLeft.applyQuaternion(q).vadd(center), upRight.applyQuaternion(q).vadd(center), lowRight.applyQuaternion(q).vadd(center), lowLeft.applyQuaternion(q).vadd(center)];
        arr.push(arr[0]);
        return this.drawPolyLine(arr, clearDelay, color);
    }

    public static drawCircle(center: Laya.Vector3, radius: number, axis: Laya.Vector3 = Laya.Vector3.forward, clearDelay: number = 1000, color?: Laya.Color, segment?: number) {
        var color = color || Laya.Color.RED;
        let lineNum = segment || 35;
        let points: Laya.Vector3[] = [];
        let line = this.getLine();
        line.maxLineCount = lineNum;
        let pre: Laya.Vector3;
        let q = new Laya.Quaternion();
        q.setFromUnitVectors(Laya.Vector3.forward, axis);
        for (let i = 0; i < lineNum; i++) {
            let rad = i / lineNum * Mathf.PI * 2;
            let x = Mathf.Sin(rad) * radius;
            let y = Mathf.Cos(rad) * radius;
            let p = new Laya.Vector3(x, y, 0);
            p.applyQuaternion(q);
            p.vadd(center, p);
            points.push(p);

            if (pre) {
                line.addLine(pre, p, color, color);
                if (i === lineNum - 1) line.addLine(points[0], p, color, color);
            }

            pre = p;
        }
        if (clearDelay !== Infinity) Laya.timer.once(clearDelay, this, this.recycle, [line], false);
        return line;
    }

    static recycle(line: Laya.PixelLineSprite3D) {
        line.active = false;
        line.clear();
        this.lines.push(line);
    }

    static getLine() {
        let line: Laya.PixelLineSprite3D;
        if (this.lines.length > 0) {
            line = this.lines.pop();
            line.active = true;
            return line;
        }
        line = new Laya.PixelLineSprite3D();
       GameData.scene3d.addChild(line);
        return line;
    }

    public static clear() {
        this.lines = [];
        Laya.timer.clearAll(this);
    }
}