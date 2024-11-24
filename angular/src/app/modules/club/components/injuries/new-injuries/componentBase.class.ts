import { UntypedFormGroup } from '@angular/forms';


export abstract class ComponentBaseClass {

  validacionIncorrectaComponente = false;

  abstract onSubmit(): void;
  abstract validateForm(): boolean;

  limpiarFormulario(groupForm: UntypedFormGroup): void {
    groupForm.reset();
    groupForm.clearValidators();
    groupForm.updateValueAndValidity();
    groupForm.markAsUntouched();
    groupForm.markAsPristine();
    Object.keys(groupForm.controls).forEach(key => {
      groupForm.controls[key].setValue(null);
      groupForm.controls[key].setErrors(null);
    });
  }

  validarFormControlGroup(groupForm: UntypedFormGroup): void {
    Object.keys(groupForm.controls).forEach(key => {
      groupForm.controls[key].markAsDirty();
    });
  }

  llenarFormulario(groupForm: UntypedFormGroup, objeto: any): void {
    Object.keys(objeto).forEach(key => {
      if (groupForm.controls[key] !== undefined) {
        groupForm.controls[key].setValue(objeto[key]);
      }
    });
  }

}
