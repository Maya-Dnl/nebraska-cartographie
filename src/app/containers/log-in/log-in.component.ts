import { ChangeDetectorRef, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { passwordMatchValidator } from './password-match.validator';
import { EmailValidator } from './email.validator';
import { AuthProcessService } from '../../services/authentication-service.service';
import { Router } from '@angular/router';
import { changeTitle } from '../../store/global.actions';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})

export class LogInComponent {
  email = new FormControl('', [Validators.required, EmailValidator]);
  registerForm: FormGroup;

  password = new FormControl('', [Validators.required]);

  hidePassword = true;

  connexionMode: ConnexionMode = ConnexionMode.undefined;


  private _email: string = "";

  constructor(private cdr: ChangeDetectorRef,
    private store: Store<AppState>,
    private router: Router,
    public authProcess: AuthProcessService,
    private fb: FormBuilder) {

    this.registerForm = this.fb.group({
      passwordSubscribe: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      passwordConfirm: ['', [Validators.required]]
    }, { validator: passwordMatchValidator });
  }

  checkEmail() {
    this.email.markAsTouched();
    this.email.updateValueAndValidity();

    if (!this.email.valid || this.email.value == null) {
      return;
    }

    console.log(this.email.value)
    this._email = this.email.value;
    this.email.disable();
    this.authProcess.signInTestEmailExist(this._email).then(exist => {
      if (exist === true) {
        this.connexionMode = 1;
        this.store.dispatch(changeTitle({ newTitle: 'Connexion' }));
      } else if (exist === false) {
        this.connexionMode = 2
        this.store.dispatch(changeTitle({ newTitle: 'Inscription' }));
      } else {
        throw new Error("Le fetch de l'email est en erreur")
      }
    })
  }


  signIn() {
  
    if(this._email == null || this.password.value == null)
      {
        return;
      }
    this.authProcess.signInWith({email: this._email, password: this.password.value}).then(() => {
  
          this.router.navigateByUrl("/");
        
    })
  }
}

export enum ConnexionMode {
  undefined = 0,
  connexion = 1,
  inscription = 2
}