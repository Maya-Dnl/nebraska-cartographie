import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { merge } from 'rxjs';
import { passwordMatchValidator } from './password-match.validator';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})

export class LogInComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  registerForm: FormGroup;

  password = new FormControl('', [Validators.required]);
  
  hidePassword = true;

  connexionMode: ConnexionMode = ConnexionMode.connexion;

  constructor(private formBuilder: FormBuilder) {

    this.registerForm = this.formBuilder.group({
      passwordSubscribe: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      passwordConfirm: ['', [Validators.required]]
      }, {validator: passwordMatchValidator});
  }

  checkEmail() {
    console.log(this.email.value)
  }
}

export enum ConnexionMode {
  undefined = 0,
  connexion = 1,
  inscription = 2
}