import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
  name: 'filterArray',
  pure: false
} )
export class FilterArrayPipe implements PipeTransform {
  
  transform( items: any[], field: string, value: any, type: string = 'equals' ): any[] {
    if ( !items ) {
      return [];
    }
    if ( type === 'greater_than' ) {
      return items.filter( it => it[ field ] > value );
    } else if ( type === 'less_than' ) {
      return items.filter( it => it[ field ] <= value );
    } else {
      return items.filter( it => it[ field ] === value );
    }
  }
  
}
