import Mathf from "./Mathf";


export default class Utils {
    static get onMiniGame() {
        return Laya.Browser.onMiniGame;
    }

    public static size(obj: any): number {
        let index = 0;
        for (const k in obj) index++
        return index;
    }

    public static loadObj(url): Promise<Laya.Sprite3D> {
        return new Promise<Laya.Sprite3D>(resolve => {
            Laya.Sprite3D.load(url, Laya.Handler.create(null, res => resolve(res)));
        });
    }

    public static wait(time: number) {
        return new Promise(resolve => {
            Laya.timer.once(time, null, () => resolve());
        });
    }

    // 世界坐标转屏幕坐标
    public static WorldToScreen(point, camera) {
        var tx = camera.transform;
        var pointA = Utils.InverseTransformPoint(tx, point);
        var distance = pointA.z;
        var halfFOV = (camera.fieldOfView * 0.5) * Mathf.Deg2Rad;
        var height = distance * Math.tan(halfFOV);
        var width = height * camera.aspectRatio;

        // 相机在 distance距离的截面左下角世界坐标位置
        // LowerLeft
        var lowerLeft = new Laya.Vector3();

        // lowerLeft = tx.position - (tx.right * width);
        var right = new Laya.Vector3();
        tx.getRight(right);
        var xx = new Laya.Vector3(right.x * width, right.y * width, right.z * width);
        Laya.Vector3.subtract(tx.position, xx, lowerLeft);
        // lowerLeft -= tx.up * height;
        var up = new Laya.Vector3();
        tx.getUp(up);
        var yy = new Laya.Vector3(up.x * height, up.y * height, up.z * height);
        Laya.Vector3.subtract(lowerLeft, yy, lowerLeft);
        // lowerLeft += tx.forward * distance;
        var forward = new Laya.Vector3();
        tx.getForward(forward);
        var zz = new Laya.Vector3(-forward.x * distance, -forward.y * distance, -forward.z * distance);
        Laya.Vector3.add(lowerLeft, zz, lowerLeft);

        // 根据比例计算屏幕相对于世界坐标的比例
        var v = new Laya.Vector3();
        v.x = Laya.stage.width / width / 2;
        v.y = Laya.stage.height / height / 2;
        // v.x = Laya.Browser.clientWidth / width / 2;
        // v.y = Laya.Browser.clientHeight / height / 2;
        v.z = 0;

        // 放到同一坐标系（相机坐标系）上计算相对位置
        var value = new Laya.Vector3();
        var lowerLeftA = this.InverseTransformPoint(tx, lowerLeft);
        Laya.Vector3.subtract(pointA, lowerLeftA, value);
        // 计算屏幕坐标系
        value = new Laya.Vector3(value.x * v.x, value.y * v.y, pointA.z);

        return value;
    }

    public static WorldToScreen2(point: Laya.Vector3, camera: Laya.Camera, out?: Laya.Vector4) {
        out = out || new Laya.Vector4();
        //转换坐标
        camera.viewport.project(point, camera.projectionViewMatrix, out);
        //赋值给2D
        out.x /= Laya.stage.clientScaleX;
        out.y /= Laya.stage.clientScaleY;
        return out;
    }

    // 屏幕坐标转世界坐标
    public static ScreenToWorld(point: Laya.Vector3, camera: Laya.Camera) {
        var distance = point.y;
        var halfFOV = (camera.fieldOfView * 0.5) * Mathf.Deg2Rad;
        var height = distance * Math.tan(halfFOV);
        var width = height * camera.aspectRatio;

        // 相机在 distance距离的截面左下角世界坐标位置
        // LowerLeft
        var lowerLeft = new Laya.Vector3();
        var tx = camera.transform;

        // lowerLeft = tx.position - (tx.right * width);
        var right = new Laya.Vector3();
        tx.getRight(right);
        var xx = new Laya.Vector3(right.x * width, right.y * width, right.z * width);
        Laya.Vector3.subtract(tx.position, xx, lowerLeft);
        // lowerLeft -= tx.up * height;
        var up = new Laya.Vector3();
        tx.getUp(up);
        var yy = new Laya.Vector3(up.x * height, up.y * height, up.z * height);
        Laya.Vector3.subtract(lowerLeft, yy, lowerLeft);
        // lowerLeft += tx.forward * distance;
        var forward = new Laya.Vector3();
        tx.getForward(forward);
        var zz = new Laya.Vector3(-forward.x * distance, -forward.y * distance, -forward.z * distance);
        Laya.Vector3.add(lowerLeft, zz, lowerLeft);

        // 根据比例计算屏幕相对于世界坐标的比例
        var v = new Laya.Vector3();
        v.x = width / Laya.stage.width * point.x * 2;
        v.z = height / Laya.stage.height * point.z * 2;
        // v.x = width / Laya.Browser.clientWidth * point.x * 2;
        // v.y = height / Laya.Browser.clientHeight * point.y * 2;
        v.y = 0;

        // 放到同一坐标系（相机坐标系）上计算相对位置
        var value = new Laya.Vector3();
        lowerLeft = Utils.InverseTransformPoint(tx, lowerLeft);
        Laya.Vector3.add(lowerLeft, v, value);
        // 转回世界坐标系
        value = Utils.TransformPoint(tx, value);
        return value;
    }

    // 世界坐标转相对坐标
    public static InverseTransformPoint(origin, point) {
        var xx = new Laya.Vector3();
        origin.getRight(xx);
        var yy = new Laya.Vector3();
        origin.getUp(yy);
        var zz = new Laya.Vector3();
        origin.getForward(zz);
        var zz1 = new Laya.Vector3(-zz.x, -zz.y, -zz.z);

        var x = Utils.ProjectDistance(point, origin.position, xx);
        var y = Utils.ProjectDistance(point, origin.position, yy);
        var z = Utils.ProjectDistance(point, origin.position, zz1);
        var value = new Laya.Vector3(x, y, z);
        return value;
    }

    // 相对坐标转世界坐标
    public static TransformPoint(origin, point) {
        var value = new Laya.Vector3();
        Laya.Vector3.transformQuat(point, origin.rotation, value);
        Laya.Vector3.add(value, origin.position, value);
        return value;
    }

    // 向量投影长度
    public static ProjectDistance(first, cen, second) {
        var aa = new Laya.Vector3();
        Laya.Vector3.subtract(first, cen, aa);
        var angle = Laya.Vector3.angle(aa, second) * Mathf.Deg2Rad;
        var distance = Laya.Vector3.distance(first, cen);
        distance *= Math.cos(angle);
        return distance;
    }

    /**
     * 精简数组, 减少点数量
     * @param arr 数组
     * @param dropDis 采样距离
     */
    public static simplifyArray(points: number[], dropDis: number = 20) {
        let arr = [];
        let p = new Laya.Vector2();
        let last = new Laya.Vector2();
        for (let i = 0; i < points.length; i += 2) {
            p.set(points[i], points[i + 1]);
            if (arr.length >= 2) last.set(arr[arr.length - 2], arr[arr.length - 1]);
            let dis = p.distanceTo(last);
            if (dis > dropDis || i === points.length - 4) arr.push(p.x, p.y);
        }
       // Log.log('source arr length', points.length, 'spmplify', arr.length);
        return arr;
    }

    /**
     * 平滑数组，使点均匀分布
     * @param points 点数组
     * @param pointDis 点距离
     */
    public static smoothArray(points: number[], pointDis: number = 1) {
        let p = new Laya.Vector2();
        let next = new Laya.Vector2();
        let dis = 0;
        let offset = 0;
        let vector = new Laya.Vector2();
        let vectors = {};
        let points2: number[] = [];

        for (let i = 0; i < points.length; i += 2) {
            p.set(points[i], points[i + 1]);
            points2.push(points[i], points[i + 1]);
            if (i <= points.length - 4) {
                next.set(points[i + 2], points[i + 3]);
                let temp = p.distanceTo(next);
                let num = Mathf.Floor(temp / pointDis);
                if (num > 1) {
                    let d = temp / num;
                    next.vsub(p, vector);
                    vector.normalize();
                    for (let j = 1; j <= num; j++) {
                        let newP = p.vadd(vector.mult(d * j));
                        points2.push(newP.x, newP.y);
                    }
                }
            }
        }

        points = points2;

        for (let i = 0; i < points.length; i += 2) {
            p.set(points[i], points[i + 1]);
            if (i <= points.length - 4) {
                next.set(points[i + 2], points[i + 3]);
                next.vsub(p, vector);
                vector.normalize();
                vectors[i] = vector.clone();
                let temp = p.distanceTo(next);
                dis += temp;
            }
        }

        offset = dis / (points.length / 2);

        for (let i = 0; i < points.length; i += 2) {
            p.set(points[i], points[i + 1]);
            if (i <= points.length - 4) {
                vector.copy(vectors[i]);
                p.vadd(vector.mult(offset), next);
                points[i + 2] = Mathf.Floor(next.x);
                points[i + 3] = Mathf.Floor(next.y);
            }
        }
        // Log.log('points count', points.length, 'line length', dis, 'offset', offset);
        return points;
    }

    public static createDownload(str: string) {
        let aLink = document.createElement('a');
        aLink.setAttribute('target', '_blank');
        aLink.setAttribute('download', 'config.txt');
        document.body.appendChild(aLink);
        aLink.href = "data:text/txt;charset=utf-8," + str;
        aLink.click();
        document.body.removeChild(aLink);
    }
}