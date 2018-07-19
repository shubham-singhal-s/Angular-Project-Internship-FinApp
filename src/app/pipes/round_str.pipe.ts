import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'tostr'
})
export class ToStr implements PipeTransform {
    transform(val: number): string {
        var str=" ";
        if (Math.abs(val) > 99999 && Math.abs(val) < 10000000) {
            val = val / 100000;
            val = Math.round(val * 100) / 100;
            str += val.toLocaleString();
            str += ' Lac';
        }
        else if (Math.abs(val) > 9999999) {
            val = val / 10000000;
            val = Math.round(val * 100) / 100;
            str += val.toLocaleString();
            str += ' Cr.';
        }
        else if (Math.abs(val) > 999 && Math.abs(val) < 100000) {
            val = val / 1000;
            val = Math.round(val * 100) / 100;
            str += val.toLocaleString();
            str += 'K';
        }
        else{
            val = Math.round(val * 100) / 100;
            str+=val.toLocaleString();
        }
        return str;
    }
}