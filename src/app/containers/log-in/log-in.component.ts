import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from './password-match.validator';
import { EmailValidator } from './email.validator';
import { AuthProcessService } from '../../services/authentication-service.service';
import { Router } from '@angular/router';
import { changeTitle, userLogInSuccess } from '../../store/global.actions';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { UserRole } from '../../store/models/user.model';

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

  isProductionEnvironment = environment.production;

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
        this.connexionMode = ConnexionMode.connexion;
        this.store.dispatch(changeTitle({ newTitle: 'Connexion' }));
      } else if (exist === false) {
        this.connexionMode = ConnexionMode.inscription
        this.store.dispatch(changeTitle({ newTitle: 'Inscription' }));
      } else {
        throw new Error("Le fetch de l'email est en erreur")
      }
    })
  }


  signIn() {

    if (this._email == null || this.password.value == null) {
      return;
    }
    this.authProcess.signInWith({ email: this._email, password: this.password.value }).then(() => {

      this.router.navigateByUrl("/");

    })
  }

  

  MockUserConnection(userRole: UserRole) {
    switch (userRole) {
      case UserRole.techAdministrator:
        this.store.dispatch(userLogInSuccess({
          user: {
            id: "mocktechadmin",
            mail: "maya@gmail.com",
            creationDate: "",
            role: 0
          }
        }));
        break;
      case UserRole.nebraskaAdministrator:
        this.store.dispatch(userLogInSuccess({
          user: {
            id: "mocknebraskaadmin",
            mail: "nebraska@gmail.com",
            creationDate: "",
            role: 1
          }
        }));
        break;
      case UserRole.contributor:
        this.store.dispatch(userLogInSuccess({
          user: {
            id: "mockcontributor",
            mail: "jojo@gmail.com",
            creationDate: "",
            role: 2
          }
        }));
        break;

    }
  }

}

export enum ConnexionMode {
  undefined = 0,
  connexion = 1,
  inscription = 2
}