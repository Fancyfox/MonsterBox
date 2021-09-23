

export default class RandomUtil {
    public static Random(min: number = 0, max: number = 1): number {
        return min + (max - min) * Math.random();
    }

    public static RandomInteger(min: number = 0, max: number = 1): number {
        let ran = this.Random(min, max);
        return Math.floor(ran);
    }

    public static Shuffle(array: any[]) {
        for (let len = array.length, i = len - 1; i >= 0; i--) {
            let ran: number = Math.floor(Math.random() * i);
            let temp = array[ran];
            array[ran] = array[i];
            array[i] = temp;
        }
        return array;
    }
}
