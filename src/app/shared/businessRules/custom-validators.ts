import { ValidationErrors, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';

export class CustomValidators {

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  static autocompleteObjectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        if (control.value === '')
          return { required: true };
        else
          return { invalidAutocompleteValue: { value: control.value } };
      }
      return null;
    };
  }


  static autocompleteObjectValidatorNoRquired(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        if (control.value !== '') 
          return { invalidAutocompleteValue: { value: control.value } };
      }
      return null;
    };
  }

  static requiredAtleastOneRamos_y_Empresas_de_Usuario(control: AbstractControl): ValidationErrors | null {
    let result = { requiredAtleastOneRamos_y_Empresas_de_Usuario: true };
    if (control.value !== null && control.value !== undefined) {
      if (control.value.length > 0) {
        result = null;
      } else {
        result = { requiredAtleastOneRamos_y_Empresas_de_Usuario: true };
      }
    } else {
      result = null;
    }
    //console.log(result);
    return result;
  }

  static maxDateTodayValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const today = new Date();
      const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (control.value && control.value > maxDate) {
        return { maxDateToday: true };
      }
      return null;
    };
  }

  static email(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
      if (control.value && !EMAIL_REGEXP.test(control.value)) {
        return { invalidEmail: true };
      }
      return null;
    };
  }

}
