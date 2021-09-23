import Mathf from "./Mathf";

export default (function () {
    Laya.Graphics.prototype.drawCircleWithAngle = function drawCircleWithAngle(x: number, y: number, radius: number, startAngle: number, endAngle: number, offset: number, clockwise: boolean, fillColor: string, lineColor: string, lineWidth: number) {
        let self = this as Laya.Graphics;

        let delta = 1;

        startAngle += offset;
        endAngle += offset;

        let temp = endAngle;
        if (startAngle > endAngle) {
            endAngle = startAngle;
            startAngle = temp;
        }

        if (endAngle - startAngle < delta) return;

        var points = [];
        for (let i = startAngle; i <= endAngle; i += delta) {
            let rad = i * Mathf.Deg2Rad;
            points.push(Mathf.Sin(rad) * radius, Mathf.Cos(rad) * radius);
        }
        if (!clockwise) points.reverse();

        if (fillColor) {
            if (endAngle - startAngle < 360) points.push(x, y);
            self.drawPoly(x, y, points, fillColor, lineColor, lineWidth);
        }
        else self.drawLines(x, y, points, lineColor, lineWidth);
    }
})();