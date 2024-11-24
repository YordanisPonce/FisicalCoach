import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive( {
  // tslint:disable-next-line:directive-selector
  selector: '[sin-numeros-reactive]'
} )
export class SinNumerosReactiveDirective {
  constructor( private el: ElementRef, private control: NgControl ) {
  }

  @HostListener( 'input', [ '$event' ] ) onEvent( $event: any ) {
    let valTransformar = this.el.nativeElement.value;
    if ( valTransformar && valTransformar.length > 0 ) {
      valTransformar = this.limpiar( valTransformar );
      // @ts-ignore
      this.control.control.setValue( valTransformar );
    }

  }

  limpiar( valor: any ) {
    let val = '';
    const regex = '[^a-zA-ZÑñÁáÉéóÓúÚíÍ ]';
    const regx = new RegExp( regex, 'g' );
    val = valor.replace( regx, '' );
    return val;
  }

  @HostListener( 'blur', [ '$event' ] ) onBlur( $event: any ) {
    let outPut = this.el.nativeElement.value;
    if ( outPut && outPut.length > 0 ) {
      outPut = outPut.trim();
    }
    // @ts-ignore
    this.control.control.setValue( outPut );
  }


}
