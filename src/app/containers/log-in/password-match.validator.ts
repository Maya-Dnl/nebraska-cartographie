import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('passwordSubscribe');
  const confirmPassword = control.get('passwordConfirm');


  if (!password || !confirmPassword) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
  } else {
    confirmPassword.setErrors(null);
  }
  return null; // Ne renvoie pas d'erreur au niveau du groupe de formulaire
}