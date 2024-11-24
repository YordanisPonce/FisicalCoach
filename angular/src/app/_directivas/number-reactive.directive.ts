import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive( {
  selector: '[appNumberDirective]'
} )
export class NumberReactiveDirective {

  @Input() minimo: number;
  @Input() maximo: number;

  constructor( private el: ElementRef, private control: NgControl ) {
  }

  @HostListener( 'input', [ '$event' ] ) onEvent( event: any ) {
    const valTransformar = this.convertFloat( event.data );
    let outPut = valTransformar;
    const temp = outPut.toString();

    const maxLength = 19;
    if ( temp.length >= maxLength ) {
      outPut = temp.slice( 0, maxLength );
    }

    const max = '9223372036854775807';
    if ( Number( outPut ) > Number( max ) ) {
      outPut = max;
    }
    if ( this.maximo && Number( outPut ) > this.maximo ) {
      outPut = this.maximo.toString();
    }
    // @ts-ignore
    this.control.control.setValue( outPut );
    this.control.control?.updateValueAndValidity();
  }

  @HostListener( 'blur', [ '$event' ] ) onBlur( event: any ) {
    let outPut = this.convertFloat( event.data );
    if ( this.minimo && Number( outPut ) < this.minimo ) {
      outPut = this.minimo;
    }
    if ( this.maximo && Number( outPut ) > this.maximo ) {
      outPut = this.maximo.toString();
    }
    // @ts-ignore
    this.control.control.setValue( ( outPut && !isNaN( outPut ) ) ? Number( outPut ) : outPut );
  }

  convertFloat( value: any ) {
    const newVal = value.toString().replace( /[^0-9.]/gi, '' ).replace( '..', '.' );
    if ( newVal !== '' && newVal !== '..' ) {
      if ( newVal.split( '.' ).length > 2 ) {
        value = parseFloat( newVal );
      } else if ( newVal === '.' ) {
        value = newVal;
      } else if ( value.search( /\d*\.\D*/ ) !== -1 || value.search( /\d*\D*/ ) !== -1 ) {
        value = value.replace( /[^0-9.]/gi, '' ).replace( '..', '.' );
      }
      const temp = value.toString();
      const maxlen = this.el.nativeElement.getAttribute( 'maxlength' );
      if ( maxlen && temp.length > maxlen ) {
        value = parseFloat( temp.slice( 0, this.el.nativeElement.getAttribute( 'maxlength' ) ) );
      }
      return value;
    } else {
      return '';
    }
  }


}
