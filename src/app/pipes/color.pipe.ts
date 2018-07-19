import {Pipe, PipeTransform} from '@angular/core';
@Pipe ({
   name : 'color'
})
export class ColorPipe implements PipeTransform {
   transform(val : string) : string {
       var startRed='<b class="redc">';
       var startGreen='<b class="greenc">';
       var end='</b>';
       var str;
       if(val.indexOf('-')!=-1){
           str=startRed+val+end;
       }
       else{
            str=startGreen+val+end;
       }
      return str;
   }
}