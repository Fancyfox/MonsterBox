declare class pako {
    static deflate: (input: any, option?: any) => any;
    static inflate: (input: any, option?: any) => any;
    static gzip: (input: any, option?: any) => any;
    static ungzip: (input: any, option?: any) => any;
}