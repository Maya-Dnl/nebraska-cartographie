import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  styleUrls: ['./log-in.component.scss']
})

export class LogInComponent {

  emailLogin = this.fb.control('', [Validators.required, Validators.email]);
  passwordLogin = this.fb.control('', [Validators.required]);
  registerForm: FormGroup;
  hidePassword = true;
  connectionMode: ConnectionMode = ConnectionMode.connection;

  isProductionEnvironment = environment.production;



  constructor(
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>,
    private router: Router,
    public authProcess: AuthProcessService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.registerForm = this.fb.group({
      emailSubscribe: ['', [Validators.required, Validators.email]],
      passwordSubscribe: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      passwordConfirm: ['', [Validators.required]]
    }, { validator: passwordMatchValidator });
  }
  
  signIn() {
    if (this.emailLogin.invalid || this.passwordLogin.invalid) {
      return;
    }
  
    this.authProcess.signInWith({ email: this.emailLogin.value!, password: this.passwordLogin.value! })
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
                this.resendVerificationEmail();
              }
            });
            break;
          case SignInResult.wrongCredentials:
            this.dialog.open(PopUpUserConfirmComponent, {
              width: '400px',
              backdropClass: 'backdrop-blur',
              panelClass: ['overlay-pop-up', 'error-popup'],
              data: { message: "L'email et/ou le mot de passe est incorrect.", modePopup: ModeConfirmPopup.Ok }
            });
            break;
          case SignInResult.tooManyRequests:
            this.dialog.open(PopUpUserConfirmComponent, {
              width: '400px',
              backdropClass: 'backdrop-blur',
              panelClass: ['overlay-pop-up', 'error-popup'],
              data: { message: "Trop de tentatives, réessayez plus tard !", modePopup: ModeConfirmPopup.Ok }
            });
            break;
          case SignInResult.signInSuccess:
            this.router.navigateByUrl("/");
            break;
        }
      })
      .catch((error) => {
        let errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        
        if (error.code) {
          switch (error.code) {
            case 'auth/invalid-email':
              errorMessage = 'L\'email fourni n\'est pas valide. Veuillez fournir un email valide.';
              break;
            // Ajoutez d'autres cas d'erreur Firebase si nécessaire
          }
        }
  
        this.dialog.open(PopUpUserConfirmComponent, {
          width: '400px',
          backdropClass: 'backdrop-blur',
          panelClass: ['overlay-pop-up', 'error-popup'],
          data: { message: errorMessage, modePopup: ModeConfirmPopup.Ok }
        });
      });
  }
  

  async signUp() {
    let emailSubscribe = this.registerForm.controls['emailSubscribe'].value;
    let passwordSubscribe = this.registerForm.controls['passwordSubscribe'].value;
    let passwordConfirm = this.registerForm.controls['passwordConfirm'].value;

    if (this.registerForm.invalid) {
        return;
    }

    try {
        await this.authProcess.signUp({
            email: emailSubscribe,
            password: passwordConfirm
        });

        this.dialog.open(PopUpUserConfirmComponent, {
            width: '400px',
            backdropClass: 'backdrop-blur',
            panelClass: 'overlay-pop-up',
            data: { message: 'Votre compte a bien été créé, veuillez vérifier vos emails et cliquer sur le lien afin de le valider avant de vous connecter.', modePopup: ModeConfirmPopup.Ok }
        }).afterClosed().subscribe(() => {
            this.resetLogin();
        });

    } catch (error: any) {
        let errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        
        if (error.code) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Cet email est déjà utilisé. Veuillez utiliser un autre email.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'L\'email fourni n\'est pas valide. Veuillez fournir un email valide.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'L\'inscription avec email et mot de passe n\'est pas activée.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Le mot de passe est trop faible. Veuillez fournir un mot de passe plus fort.';
                    break;
                // Ajoutez d'autres cas d'erreur Firebase si nécessaire
            }
        }

        this.dialog.open(PopUpUserConfirmComponent, {
            width: '400px',
            backdropClass: 'backdrop-blur',
            panelClass: ['overlay-pop-up', 'error-popup'],
            data: { message: errorMessage, modePopup: ModeConfirmPopup.Ok }
        });
    }
}


  resetLogin() {
    this.connectionMode = ConnectionMode.connection;
    this.emailLogin.reset();
    this.passwordLogin.reset();
    this.registerForm.reset();
  }

  resendVerificationEmail() {
    this.authProcess.sendEmailVerification({
      email: this.emailLogin.value!,
      password: this.passwordLogin.value!
    }).then(() => {
      this.dialog.open(PopUpUserConfirmComponent, {
        width: '400px',
        backdropClass: 'backdrop-blur',
        panelClass: 'overlay-pop-up',
        data: { message: 'Un nouveau mail de confirmation vous a été envoyé, veuillez vérifier votre boîte mail.', modePopup: ModeConfirmPopup.Ok }
      });
    }).catch(err => console.log(err));
  }

  resetPassword() {
    const email = this.emailLogin.value;
  
    if (!email) {
      this.dialog.open(PopUpUserConfirmComponent, {
        width: '400px',
        backdropClass: 'backdrop-blur',
        panelClass: ['overlay-pop-up', 'error-popup'],
        data: { message: 'Veuillez fournir un email valide.', modePopup: ModeConfirmPopup.Ok }
      });
      return;
    }
  
    this.authProcess.resetPassword(email)
      .then(() => {
        this.dialog.open(PopUpUserConfirmComponent, {
          width: '400px',
          backdropClass: 'backdrop-blur',
          panelClass: 'overlay-pop-up',
          data: { message: 'Un mail de réinitialisation de mot de passe vous a été envoyé, veuillez vérifier votre boîte mail.', modePopup: ModeConfirmPopup.Ok }
        });
      })
      .catch((error) => {
        let errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
  
        if (error.code) {
          switch (error.code) {
            case 'auth/invalid-email':
              errorMessage = 'L\'email fourni n\'est pas valide. Veuillez fournir un email valide.';
              break;
            case 'auth/user-not-found':
              errorMessage = 'Aucun utilisateur ne correspond à cet email.';
              break;
            // Ajoutez d'autres cas d'erreur Firebase si nécessaire
          }
        }
  
        this.dialog.open(PopUpUserConfirmComponent, {
          width: '400px',
          backdropClass: 'backdrop-blur',
          panelClass: ['overlay-pop-up', 'error-popup'],
          data: { message: errorMessage, modePopup: ModeConfirmPopup.Ok }
        });
      });
  }
  
  MockUserConnection(userRole: UserRole) {
    switch (userRole) {
      case UserRole.techAdministrator:
        this.store.dispatch(userLogInSuccess({
          user: {
            id: "mocktechadmin",
            mail: "maya@gmail.com",
            creationDate: "",
            role: UserRole.techAdministrator
          }
        }));
        break;
      case UserRole.nebraskaAdministrator:
        this.store.dispatch(userLogInSuccess({
          user: {
            id: "mocknebraskaadmin",
            mail: "nebraska@gmail.com",
            creationDate: "",
            role: UserRole.nebraskaAdministrator
          }
        }));
        break;
      case UserRole.contributor:
        this.store.dispatch(userLogInSuccess({
          user: {
            id: "mockcontributor",
            mail: "jojo@gmail.com",
            creationDate: "",
            role: UserRole.contributor
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
