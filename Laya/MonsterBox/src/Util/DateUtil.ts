
export default class DateUtil {
    public static isToday(time): boolean{
        return new Date(time).toLocaleDateString() == new Date().toLocaleDateString();
    }

    public static isSameDay(time1, time2): boolean{
        return new Date(time1).toLocaleTimeString() == new Date(time2).toLocaleDateString();
    }

    public static GetNextDay(time){
        let today = new Date(time).toLocaleDateString();
        let tomorrow = new Date(today).getTime() + 24 * 60 * 60 * 1000;
        return new Date(tomorrow);
    }
}
