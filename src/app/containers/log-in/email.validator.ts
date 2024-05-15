import { AbstractControl } from '@angular/forms';

export function EmailValidator(control: AbstractControl): { [key: string]: any } | null {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const valid = emailRegex.test(control.value);
  if (!valid && control.value != "") {
    return { 'invalidEmail': true };
  }
  return null;
}
