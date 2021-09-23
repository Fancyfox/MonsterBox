export default class Mathf {
    public static PI = 3.141593;
    public static Infinity = Number.MAX_SAFE_INTEGER;
    public static NegativeInfinity = Number.MIN_SAFE_INTEGER
    public static Deg2Rad = 0.01745329;
    public static Rad2Deg = 57.29578;

    public static Sin(f: number) {
        return Math.sin(f);
    }

    public static Cos(f: number) {
        return Math.cos(f);
    }

    public static Tan(f: number) {
        return Math.tan(f);
    }

    public static Asin(f: number) {
        return Math.asin(f);
    }

    public static Acos(f: number) {
        return Math.acos(f);
    }

    public static Atan(f: number) {
        return Math.atan(f);
    }

    public static Atan2(y: number, x: number) {
        return Math.atan2(y, x);
    }

    public static Sqrt(f: number) {
        return Math.sqrt(f);
    }

    public static Abs(f: number) {
        return Math.abs(f);
    }

    public static Random(min: number, max: number, float: boolean = true): number {
        return float ? Math.random() * (max - min) + min : Math.floor(Math.random() * (max - min) + min);
    }

    public static Min(...values) {
        let length = values.length;
        if (length == 0) {
            return 0;
        }
        let num3 = values[0];
        for (let i = 1; i < length; i++) {
            if (values[i] < num3) {
                num3 = values[i];
            }
        }
        return num3;
    }

    public static Max(...values) {
        let length = values.length;
        if (length == 0) {
            return 0;
        }
        let num3 = values[0];
        for (let i = 1; i < length; i++) {
            if (values[i] > num3) {
                num3 = values[i];
            }
        }
        return num3;
    }

    public static Pow(f: number, p: number) {
        return Math.pow(f, p);
    }

    public static Exp(power: number) {
        return Math.exp(power);
    }

    public static Log(f: number) {
        return Math.log(f);
    }

    public static Log10(f: number) {
        return Math.log10(f);
    }

    public static Ceil(f: number) {
        return Math.ceil(f);
    }

    public static Floor(f: number) {
        return Math.floor(f);
    }

    public static Round(f: number, n: number = 0) {
        let d = this.Pow(10, n);
        return Math.floor(f * d + 0.5) / d;
    }

    public static RoundVector3(v: Laya.Vector3, n: number = 0) {
        v.x = this.Round(v.x, n);
        v.y = this.Round(v.y, n);
        v.z = this.Round(v.z, n);
    }

    public static Sign(f: number) {
        return ((f < 0) ? -1 : 1);
    }

    public static Clamp(value: number, min: number, max: number) {
        if (value < min) {
            value = min;
            return value;
        }
        if (value > max) {
            value = max;
        }
        return value;
    }

    public static Clamp01(value: number) {
        if (value < 0) {
            return 0;
        }
        if (value > 1) {
            return 1;
        }
        return value;
    }

    public static Lerp(a: number, b: number, t: number) {
        return (a + ((b - a) * this.Clamp01(t)));
    }

    public static LerpUnclamped(a: number, b: number, t: number) {
        return (a + ((b - a) * t));
    }

    public static LerpAngle(a: number, b: number, t: number) {
        let num = this.Repeat(b - a, 360);
        if (num > 180) {
            num -= 360;
        }
        return (a + (num * this.Clamp01(t)));
    }

    public static MoveTowards(current: number, target: number, maxDelta: number) {
        if (this.Abs((target - current)) <= maxDelta) {
            return target;
        }
        return (current + (this.Sign(target - current) * maxDelta));
    }

    public static MoveTowardsAngle(current: number, target: number, maxDelta: number) {
        let num = this.DeltaAngle(current, target);
        if ((-maxDelta < num) && (num < maxDelta)) {
            return target;
        }
        target = current + num;
        return this.MoveTowards(current, target, maxDelta);
    }

    public static SmoothStep(from: number, to: number, t: number) {
        t = this.Clamp01(t);
        t = (((-2 * t) * t) * t) + ((3 * t) * t);
        return ((to * t) + (from * (1 - t)));
    }

    public static Gamma(value: number, absmax: number, gamma: number) {
        let flag = false;
        if (value < 0) {
            flag = true;
        }
        let num = this.Abs(value);
        if (num > absmax) {
            return (!flag ? num : -num);
        }
        let num3 = this.Pow(num / absmax, gamma) * absmax;
        return (!flag ? num3 : -num3);
    }

    public static Repeat(t: number, length: number) {
        return this.Clamp(t - (this.Floor(t / length) * length), 0, length);
    }

    public static PingPong(t: number, length: number) {
        t = this.Repeat(t, length * 2);
        return (length - this.Abs((t - length)));
    }

    public static InverseLerp(a: number, b: number, value: number) {
        if (a != b) {
            return this.Clamp01((value - a) / (b - a));
        }
        return 0;
    }

    public static DeltaAngle(current: number, target: number) {
        let num = this.Repeat(target - current, 360);
        if (num > 180) {
            num -= 360;
        }
        return num;
    }

    public static SmoothDamp(current: number, target: number, currentVelocity: number, smoothTime: number, maxSpeed: number = Number.MAX_SAFE_INTEGER, deltaTime: number = Laya.timer.delta * 0.001) {
        smoothTime = this.Max(0.0001, smoothTime);
        let num = 2 / smoothTime;
        let num2 = num * deltaTime;
        let num3 = 1 / (((1 + num2) + ((0.48 * num2) * num2)) + (((0.235 * num2) * num2) * num2));
        let num4 = current - target;
        let num5 = target;
        let max = maxSpeed * smoothTime;
        num4 = this.Clamp(num4, -max, max);
        target = current - num4;
        let num7 = (currentVelocity + (num * num4)) * deltaTime;
        currentVelocity = (currentVelocity - (num * num7)) * num3;
        let num8 = target + ((num4 + num7) * num3);
        if (((num5 - current) > 0) == (num8 > num5))  {
            num8 = num5;
            currentVelocity = (num8 - num5) / deltaTime;
        }
        return { value: num8, currentVelocity };
    }

    static LineIntersection(p1: Laya.Vector2, p2: Laya.Vector2, p3: Laya.Vector2, p4: Laya.Vector2, result: Laya.Vector2) {
        let num = p2.x - p1.x;
        let num2 = p2.y - p1.y;
        let num3 = p4.x - p3.x;
        let num4 = p4.y - p3.y;
        let num5 = (num * num4) - (num2 * num3);
        if (num5 == 0) {
            return false;
        }
        let num6 = p3.x - p1.x;
        let num7 = p3.y - p1.y;
        let num8 = ((num6 * num4) - (num7 * num3)) / num5;
        result = new Laya.Vector2(p1.x + (num8 * num), p1.y + (num8 * num2));
        return true;
    }

    static LineSegmentIntersection(p1: Laya.Vector2, p2: Laya.Vector2, p3: Laya.Vector2, p4: Laya.Vector2, result: Laya.Vector2) {
        let num = p2.x - p1.x;
        let num2 = p2.y - p1.y;
        let num3 = p4.x - p3.x;
        let num4 = p4.y - p3.y;
        let num5 = (num * num4) - (num2 * num3);
        if (num5 == 0) {
            return false;
        }
        let num6 = p3.x - p1.x;
        let num7 = p3.y - p1.y;
        let num8 = ((num6 * num4) - (num7 * num3)) / num5;
        if ((num8 < 0) || (num8 > 1)) {
            return false;
        }
        let num9 = ((num6 * num2) - (num7 * num)) / num5;
        if ((num9 < 0) || (num9 > 1)) {
            return false;
        }
        result = new Laya.Vector2(p1.x + (num8 * num), p1.y + (num8 * num2));
        return true;
    }
}