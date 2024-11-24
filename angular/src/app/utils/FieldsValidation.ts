export default class FieldsValidation {
  // static doSomething(val: string) { return val; }
  // static doSomethingElse(val: string) { return val; }

  validateField( field: string, form: any ) {
    return form.get( field )?.invalid;
  }

  validateStepFields( fields: string[], form: any ) {
    let invalidFields: boolean = false;
    fields.forEach( field => {
      if ( this.validateField( field, form ) ) {
        invalidFields = true;
        form.get( field )?.markAsTouched( { onlySelf: true } );
      }
    } );
    return invalidFields;
  }
}
