import Mathf from "../Extensions/Mathf";

export default class ColorUtil {
    public static toHex(color: Laya.Color) {
        let aColor = [];
        aColor.push(Mathf.Round(color.r * 255));
        aColor.push(Mathf.Round(color.g * 255));
        aColor.push(Mathf.Round(color.b * 255));
        var strHex = "#";
        for (var i = 0; i < aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            if (hex.length < 2) {
                hex = '0' + hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = '#ffffff';
        }
        return strHex;
    }

    public static fromHex(sColor: string) {
        sColor = sColor.toLowerCase();
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        // 如果是16进制颜色
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return new Laya.Color(sColorChange[0] / 255, sColorChange[1] / 255, sColorChange[2] / 255, 1);
        }
        return new Laya.Color();
    }
}