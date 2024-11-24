export default class FormUtils {

  removeNullValues( formObject: any ) {
    Object.keys( formObject ).forEach( key => {
      if ( formObject[ key ] && typeof formObject[ key ] === 'object' ) {
        this.removeNullValues( formObject[ key ] );
      } else if ( formObject[ key ] === null || formObject[ key ] === undefined ) {
        delete formObject[ key ];
      }
    } );
    return formObject;
  }
}
