import { AbstractControl, ValidatorFn } from '@angular/forms';
 
export function customEmailValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if (!control.value) {
      // If the field is empty, consider it valid (optional field)
      return null;
    }
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/; // Modify as needed
    const valid = emailRegex.test(control.value);
    return valid ? null : {'invalidEmail': {value: control.value}};
  };
}