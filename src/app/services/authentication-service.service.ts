import '@firebase/auth';
import { EventEmitter, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { userLogInSuccess, userLogOutSuccess } from '../store/global.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { UserRole } from '../store/models/user.model';
import { MatDialog } from '@angular/material/dialog';

import UserCredential = firebase.auth.UserCredential;


export interface ICredentials {
  email: string;
  password: string;
}

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export enum AuthProvider {
  EmailAndPassword = "firebase",
  Google = "google",
}

@Injectable({
  providedIn: "root",
})

export class AuthProcessService {
  onSuccessEmitter: EventEmitter<any> = new EventEmitter<any>();
  onErrorEmitter: EventEmitter<any> = new EventEmitter<any>();

  // Useful to know about auth state even between reloads.
  // Replace emailConfirmationSent and emailToConfirm.

  messageOnAuthSuccess: string = '';
  messageOnAuthError: string = '';

  constructor(
    public afa: AngularFireAuth,
    private store: Store<AppState>,
    public dialog: MatDialog
  ) { }

  /**
   * Reset the password of the ngx-auth-firebaseui-user via email
   *
   * @param email - the email to reset
   */
  public async resetPassword(email: string): Promise<void> {
    try {
      console.log("Password reset email sent");
      return await this.afa.sendPasswordResetEmail(email);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Savoir si le mail est deja connu de firebase
   * @param email l'email de l'utilisateur
   * @returns true si deja connu sinon false
   */
  public async signInTestEmailExist(email: string): Promise<boolean | null> {
    try {
      let result = (await this.afa.fetchSignInMethodsForEmail(email));
      console.log(result);
      if (result.find(v => v == "password")) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      this.handleError(err);
      return null;
    }
  }

  /**
   * Login with email and password
   * @param credentials mail & password
   */
  public async signInWith(credentials: ICredentials): Promise<SignInResult> {

    return await this.afa.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    ).then(async (signInResult) => {

      if (signInResult.user?.emailVerified === false) {
        await this.signOut();
        return SignInResult.emailNotVerified
      };

      let role: UserRole

      switch (signInResult.user?.email) {
        case "maya.dnl29@gmail.com":
          role = UserRole.techAdministrator
          break;
        case "carto.nebraska@gmail.com":
          role = UserRole.nebraskaAdministrator
          break;
        default:
          role = UserRole.contributor
          break;
      };

      this.store.dispatch(userLogInSuccess({
        user: {
          id: signInResult.user?.uid!,
          mail: signInResult.user?.email!,
          creationDate: signInResult.user?.metadata.creationTime!,
          role: role
        }
      }));

      return SignInResult.signInSuccess;

    }).catch((err) => {
      if (err.code === 'auth/wrong-password') {
        return SignInResult.wrongCredentials
      } else if (err.code === 'auth/too-many-requests')
        {
          return SignInResult.tooManyRequests
        }
      console.error(err)
      throw err;
    }).finally(() => { console.log("end of signin process") });
  }

  /**
   * Sign up new users via email and password.
   * After that the ngx-auth-firebaseui-user should verify and confirm an email sent via the firebase
   *
   * @param credentials email and password
   * @returns -
   */
  public async signUp(credentials: ICredentials) {
    try {
      const userCredential: UserCredential = await this.afa.createUserWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      let user = userCredential.user;
      if (user !== null) {
        user.sendEmailVerification();
        this.signOut()
      }

    } catch (err) {
      this.handleError(err);
    }
  }

  async sendEmailVerification(credentials: ICredentials) {
    return this.afa.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    ).then((user) => {
      user.user?.sendEmailVerification();
      this.signOut();
    }).catch(err => console.log(err))
  }

  async signOut() {
    try {
      await this.afa.signOut();
      this.store.dispatch(userLogOutSuccess())

    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error: any) {
    console.error(error);
  }

  // Refresh user info. Can be useful for instance to get latest status regarding email verification.
  reloadUserInfo(user: firebase.User) {
    user.reload();
  }

}

export enum SignInResult {
  wrongCredentials = 0,
  emailNotVerified = 1,
  signInSuccess = 2,
  tooManyRequests = 3
}