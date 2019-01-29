declare global {
    interface Date {
        todayStart(): Date;        
        toDateString(): string;
    } 
    interface String {
        padStart(maxLength: number, fillString: string): string;
        padEnd(maxLength: number, fillString: string): string;   
        encodeHtml(): string;
        camelCaseToRegularString(): string
        firstCharUpperCase(): string
    }
    interface Array<T> {
        groupBy(compareWith?: CompareWith<T>): T[][];
    }
}

type CompareWith<T = any> = (a: T, b: T) => boolean;

export function setupExtension() {

    const RequireObjectCoercible = (O: any) => {
        if (O === null || typeof O === 'undefined') {
            throw new TypeError(`"this" value must not be null or undefined`);
        }
        return O;
    };
    const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;
    const ToLength = (argument: any) => {
        const len = Number(argument);
        if (Number.isNaN(len) || len <= 0) { return 0; }
        if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
        return len;
    };
    String.prototype.padStart = function padStart(maxLength: number, fillString = ' ') {
        const O = RequireObjectCoercible(this);
        const S = String(O);
        const intMaxLength = ToLength(maxLength);
        const stringLength = ToLength(S.length);
        if (intMaxLength <= stringLength) { return S; }
        let filler = typeof fillString === 'undefined' ? ' ' : String(fillString);
        if (filler === '') { return S; }
        const fillLen = intMaxLength - stringLength;
        while (filler.length < fillLen) {
            const fLen = filler.length;
            const remainingCodeUnits = fillLen - fLen;
            if (fLen > remainingCodeUnits) {
                filler += filler.slice(0, remainingCodeUnits);
            } else {
                filler += filler;
            }
        }
        const truncatedStringFiller = filler.slice(0, fillLen);
        return truncatedStringFiller + S;
    };

    String.prototype.padEnd = function padEnd(maxLength: number, fillString = ' ') {
        const O = RequireObjectCoercible(this);
        const S = String(O);
        const intMaxLength = ToLength(maxLength);
        const stringLength = ToLength(S.length);
        if (intMaxLength <= stringLength) { return S; }
        let filler = typeof fillString === 'undefined' ? ' ' : String(fillString);
        if (filler === '') { return S; }
        const fillLen = intMaxLength - stringLength;
        while (filler.length < fillLen) {
            const fLen = filler.length;
            const remainingCodeUnits = fillLen - fLen;
            if (fLen > remainingCodeUnits) {
                filler += filler.slice(0, remainingCodeUnits);
            } else {
                filler += filler;
            }
        }
        const truncatedStringFiller = filler.slice(0, fillLen);
        return S + truncatedStringFiller;
    };

    String.prototype.encodeHtml = function encodeHtml() {
        const value = this as string;
        return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    String.prototype.camelCaseToRegularString = function camelCaseToRegularString() {
        const value = this as string;
        return value.replace(/([A-Z])/g, ' $1').toLowerCase();
    }
    
    String.prototype.firstCharUpperCase = function () {
        return (this as string).charAt(0).toUpperCase() + this.substring(1);
    };

    Date.prototype.toDateString = function () {
        const date = this as Date;
        const yearStr = date.getFullYear();
        const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
        const dateStr = date.getDate().toString().padStart(2, '0');
        return `${yearStr}-${monthStr}-${dateStr}`;
    };

    Date.prototype.todayStart = function () {
        const date = new Date(this);
        date.setHours(0, 0, 0, 0);
        return date;
    };

    Array.prototype.groupBy = function (compareWith: CompareWith = (a, b) => a === b) {
        const datas: any[] = [...this];
        const results: any[][] = [];
        while (datas.length > 0) {
            const result: any[] = [];
            const aData = datas.pop()!;
            result.unshift(aData);
            for (let i = datas.length - 1; i >= 0; i--) {
                const bData = datas[i];
                const match = compareWith(aData, bData);
                if (match) {
                    result.unshift(bData);
                    datas.splice(i, 1);
                }
            }
            results.unshift(result);
        }
        return results;
    };
}
