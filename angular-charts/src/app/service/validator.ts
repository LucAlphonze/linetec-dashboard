import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function checkUpperCase(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);

    const passwordValid = hasUpperCase;

    return !passwordValid ? { hasUpper: true } : null;
  };
}
export function checkLowerCase(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasLowerCase = /[a-z]+/.test(value);

    const passwordValid = hasLowerCase;

    return !passwordValid ? { hasLower: true } : null;
  };
}
export function checkNumber(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasNumeric = /[0-9]+/.test(value);

    const passwordValid = hasNumeric;

    return !passwordValid ? { hasNumber: true } : null;
  };
}
export function checkSpecial(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasSpecial = /[$@$!%*?&]+/.test(value);

    const passwordValid = hasSpecial;

    return !passwordValid ? { hasSp: true } : null;
  };
}
