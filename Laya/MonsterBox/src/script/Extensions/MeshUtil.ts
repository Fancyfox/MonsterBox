import Vector3 = Laya.Vector3;
import Vector2 = Laya.Vector2;
import Box3 from "./Box3";
import Mathf from "./Mathf";
import ColorUtil from "./ColorUtil";

var box: Box3;

export default class MeshUtil {
    /**
     * 生成模型
     * @param ver number[] || Vector3[]
     * @param tris number[] || number[][]
     * @param transform 变换矩阵
     * @param color 颜色
     */
    static genMesh(ver: any[], tris: any[], transform: number[], color?: string) {
        var points = ver[0] instanceof Array ? ver : this.convertPoints(ver);
        var faces = tris[0] instanceof Array ? tris : this.convertFaces(tris);
        var normals = this.computeVertexNormals(points, faces);
        var uvs = this.computeUVs(points, faces);

        var vertexDeclaration = Laya.VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
        var vertices = [];

        for (let j = 0; j < ver.length; j += 3) {
            let i = Mathf.Floor(j / 3);
            vertices.push(-ver[j], ver[j + 1], ver[j + 2], normals[i].x, normals[i].y, normals[i].z, uvs[i].x, uvs[i].y);
        }
        
        let mesh = Laya.PrimitiveMesh._createMesh(vertexDeclaration, new Float32Array(vertices), new Uint16Array(tris));
        let s = new Laya.MeshSprite3D(mesh);

        if (color) {
            let mat = new Laya.BlinnPhongMaterial();
            mat.albedoColor = ColorUtil.fromHex(color).toVector4();
            s.meshRenderer.material = mat;
        }

        let m = new Laya.Matrix4x4().fromArray(transform);
        s.transform.worldMatrix = m;

        return s;
    }

    /**
     * 计算面法线
     * @param ver 顶点数组
     * @param faces 面
     */
    static computeFaceNormals(ver: Vector3[], faces: number[][]): Vector3[] {
        var cb = new Vector3(), ab = new Vector3();
        var normals: Vector3[] = [];
        for (let i = 0, f = faces.length; i < f; i++) {
            let face = faces[i];
            let vA = ver[face[0]];
            let vB = ver[face[1]];
            let vC = ver[face[2]];
            vC.vsub(vB, cb);
            vA.vsub(vB, ab);
            cb.cross(ab, cb);
            cb.normalize();
            normals.push(cb);
        }
        return normals;
    }

    /**
     * 计算顶点法线
     * @param ver 顶点数组
     * @param faces 面
     * @param areaWeighted 是否计算面法线权重
     */
    static computeVertexNormals(ver: Vector3[], faces: number[][], areaWeighted: boolean = true) {
        let v: number;
        let vl: number;
        let f: number;
        let fl: number;
        let face: number[];
        let vertices: Vector3[];

        vertices = new Array(ver.length);

        for (v = 0, vl = ver.length; v < vl; v++) {
            vertices[v] = new Vector3();
        }

        if (areaWeighted) {
            var vA, vB, vC;
            var cb = new Vector3(), ab = new Vector3();

            for (f = 0, fl = faces.length; f < fl; f++) {

                face = faces[f];

                vA = ver[face[0]];
                vB = ver[face[1]];
                vC = ver[face[2]];

                vC.vsub(vB, cb);
                vA.vsub(vB, ab);
                cb.cross(ab, cb);

                vertices[face[0]].vadd(cb, vertices[face[0]]);
                vertices[face[1]].vadd(cb, vertices[face[1]]);
                vertices[face[2]].vadd(cb, vertices[face[2]]);

            }

        } else {

            let normals = this.computeFaceNormals(ver, faces);

            for (f = 0, fl = faces.length; f < fl; f++) {

                face = faces[f];

                vertices[face[0]].vadd(normals[f], vertices[face[0]]);
                vertices[face[1]].vadd(normals[f], vertices[face[1]]);
                vertices[face[2]].vadd(normals[f], vertices[face[2]]);

            }

        }

        for (v = 0, vl = vertices.length; v < vl; v++) {

            vertices[v].normalize();
        }

        return vertices;
    }

    /**
     * 计算UV
     * @param ver 顶点数组
     * @param faces 面
     */
    static computeUVs(ver: Vector3[], faces: number[][]) {
        let normals = this.computeVertexNormals(ver, faces);
        let uvs: Vector2[] = [];

        if (!box) box = new Box3();
        box.setFromPoints(ver);

        let size = box.getSize();

        for (let i = 0, il = ver.length; i < il; i++) {
            let normal = normals[i];

            var components = ['x', 'y', 'z'].sort((a, b) => Math.abs(normal[b]) - Math.abs(normal[a]));
            var x = components[1],
                y = components[2];

            var v1 = ver[i];

            let a = (v1[x] + size[x] * 0.5) / size[x];
            let b = (v1[y] + size[y] * 0.5) / size[y];

            uvs.push(new Vector2(a, b));
        };

        return uvs;
    }

    /**
     * number[] 2 vector3[]
     * @param ver 顶点数组
     */
    static convertPoints(ver: number[]) {
        var points: Vector3[] = [];
        for (let i = 0; i < ver.length; i += 3) {
            let p = new Vector3(ver[i], ver[i + 1], ver[i + 2]);
            points.push(p);
        }
        return points;
    }

    /**
     * number[] 2 number[][]
     */
    static convertFaces(tris: number[]) {
        var faces: number[][] = [];
        for (let i = 0; i < tris.length; i += 3) {
            let tri: number[] = [];
            let f1 = tris[i];
            let f2 = tris[i + 1];
            let f3 = tris[i + 2];
            tri.push(f1);
            tri.push(f2);
            tri.push(f3);
            faces.push(tri);
        }
        return faces;
    }

    /**
     * number[] 2 vector3[]
     * @param normals 法线数组
     */
    static convertNormals(normals: number[]) {
        var ret: Vector3[] = [];
        for (let i = 0; i < normals.length; i += 3) {
            let n = new Vector3(normals[i], normals[i + 1], normals[i + 2]);
            ret.push(n);
        }
        return ret;
    }

    /**判断三角形顶点的方向。返回1表示顺时针，0表示三点共线，-1表示逆时针。**/
    static ccw(a: Vector3, b: Vector3, c: Vector3) {
        let m00 = a.x;
        let m01 = a.y;
        let m02 = a.z;

        let m10 = b.x;
        let m11 = b.y;
        let m12 = b.z;

        let m20 = c.x;
        let m21 = c.y;
        let m22 = c.z;

        // 计算det.
        let f =
            m00 * (m11 * m22 - m12 * m21)
            + m01 * (m12 * m20 - m10 * m22)
            + m02 * (m10 * m21 - m11 * m20);

        return f > 0 ? 1 : f < 0 ? -1 : 0;
    }
}