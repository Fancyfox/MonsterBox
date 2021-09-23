interface Array<T> {
    /**
     * 去重
     */
    unique(): T[];

    /**
     * 并集
     * @param a 目标数组
     */
    union(a: T[]): T[];

    /**
     * 差集
     * @param a 目标数组
     */
    minus(a: T[]): T[];

    /**
     * 交集
     * @param a 目标数组
     */
    intersect(a: T[]): T[];
}