import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from './password-match.validator';
import { EmailValidator } from './email.validator';
import { AuthProcessService, SignInResult } from '../../services/authentication-service.service';
import { Router } from '@angular/router';
import { changeTitle, userLogInSuccess } from '../../store/global.actions';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { UserRole } from '../../store/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ModeConfirmPopup, PopUpUserConfirmComponent } from '../../components/pop-ups/user-confirm-popup/popup-user-confirm.component';

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
  ConnectionMode: ConnectionMode = ConnectionMode.undefined;


  private _email: string = "";

  isProductionEnvironment = environment.production;

  constructor(private cdr: ChangeDetectorRef,
    private store: Store<AppState>,
    private router: Router,
    public authProcess: AuthProcessService,
    private fb: FormBuilder,
    public dialog: MatDialog) {

    this.registerForm = this.fb.group({
      passwordSubscribe: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      passwordConfirm: ['', [Validators.required]]
    }, { validator: passwordMatchValidator });
  }

  checkEmail() {
    console.log("testmail");
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
        this.ConnectionMode = ConnectionMode.connection;
        this.store.dispatch(changeTitle({ newTitle: 'Connexion' }));
      } else if (exist === false) {
        this.ConnectionMode = ConnectionMode.inscription
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
    this.authProcess.signInWith({ email: this._email, password: this.password.value })
      .then((signInResult: SignInResult) => {
        switch (signInResult) {
          case SignInResult.emailNotVerified:
            this.dialog.open(PopUpUserConfirmComponent, {
              width: '400px',
              backdropClass: 'backdrop-blur',
              panelClass: 'overlay-pop-up',
              data: { message: "Vous n'avez pas encore validé votre email.", modePopup: ModeConfirmPopup.ResendMailConfirm }
            }).afterClosed().subscribe(result => {
              if (result === 'ResendMailConfirm') {
                this.resendVerificationEmail()
              }
              return
            });
            break;
          case SignInResult.wrongCredentials:
            this.dialog.open(PopUpUserConfirmComponent, {
              width: '400px',
              backdropClass: 'backdrop-blur',
              panelClass: ['overlay-pop-up', 'error-popup'],
              data: { message: "L'email et/ou le mot de passe est incorrect.", modePopup: ModeConfirmPopup.Ok }
            })
            break;
            case SignInResult.wrongCredentials:
              this.dialog.open(PopUpUserConfirmComponent, {
                width: '400px',
                backdropClass: 'backdrop-blur',
                panelClass: ['overlay-pop-up', 'error-popup'],
                data: { message: "Trop de tentatives, réessayez plus tard !", modePopup: ModeConfirmPopup.Ok }
              })
              break;
          case SignInResult.signInSuccess:
            this.router.navigateByUrl("/");
            break;
        }
      });
  };

  async signUp() {
    let passwordSubscribe = this.registerForm.controls['passwordSubscribe'].value;
    let passwordConfirm = this.registerForm.controls['passwordConfirm'].value;

    if (this._email === null
      || passwordSubscribe === null
      || passwordConfirm === null
      || passwordSubscribe !== passwordConfirm
    ) {
      return;
    }

    await this.authProcess.signUp({
      email: this._email,
      password: passwordConfirm
    });

    this.dialog.open(PopUpUserConfirmComponent, {
      width: '400px',
      backdropClass: 'backdrop-blur',
      panelClass: 'overlay-pop-up',
      data: { message: 'Votre compte a bien été créé, veuillez vérifier vos emails et cliquer sur le lien afin de le valider avant de vous connecter.', modePopup: ModeConfirmPopup.Ok }
    }).afterClosed().subscribe(result => {
      this.resetLogin();
    });
  };

  resetLogin() {
    this.ConnectionMode = ConnectionMode.connection
    this.email.disable();
  };

  resendVerificationEmail() {
    // Call service and get promise
    this.authProcess.sendEmailVerification({
      email: this._email,
      password: this.password.value!
    }).then(() => {
      this.dialog.open(PopUpUserConfirmComponent, {
        width: '400px',
        backdropClass: 'backdrop-blur',
        panelClass: 'overlay-pop-up',
        data: { message: 'Un nouveau mail de confirmation vous a été envoyé, veuillez vérifier votre boîte mail.', modePopup: ModeConfirmPopup.Ok }
      })
    }).catch((err) => console.log(err));
  }

  resetPassword() {
    this.authProcess.resetPassword(this._email);
    this.dialog.open(PopUpUserConfirmComponent, {
      width: '400px',
      backdropClass: 'backdrop-blur',
      panelClass: 'overlay-pop-up',
      data: { message: 'Un mail de réinitialisation de mot de passe vous a été envoyé, veuillez vérifier votre boîte mail. ', modePopup: ModeConfirmPopup.Ok }
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

export enum ConnectionMode {
  undefined = 0,
  connection = 1,
  inscription = 2
}