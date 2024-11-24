import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformTimestamp'
})
export class TransformTimestampPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if(value!=null){
      const [y,m,d] = value.substr(0,10).split("-")
      return `${d}/${m}/${y}`
    }
    return value
    // return value.substr(0,10);
  }

}
