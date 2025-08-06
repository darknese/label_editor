declare module 'bwip-js' {
    const bwipjs: {
        toCanvas(
            canvas: HTMLCanvasElement | string,
            options: {
                bcid: string;
                text: string;
                scale?: number;
                includetext?: boolean;
                paddingwidth?: number;
                paddingheight?: number;
                [key: string]: any;
            }
        ): void;
    };

    export default bwipjs;
}
