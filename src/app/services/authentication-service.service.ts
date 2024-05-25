import '@firebase/auth';

import { EventEmitter, forwardRef, Inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

import UserCredential = firebase.auth.UserCredential;
import { userLogInSuccess, userLogOutSuccess } from '../store/global.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';

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

  // Legacy field that is set to true after sign up.
  // Value is lost in case of reload. The idea here is to know if we just sent a verification email.
  emailConfirmationSent: boolean | null = null;
  // Legacy filed that contain the mail to confirm. Same lifecycle than emailConfirmationSent.
  emailToConfirm: string | null = null;

  constructor(
    public afa: AngularFireAuth,
    private store: Store<AppState>
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
  public async signInWith(credentials: ICredentials) {
    try {
      let signInResult: UserCredential;
      signInResult = await this.afa.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      )
      this.store.dispatch(userLogInSuccess({ user: {...signInResult.user!} }))

  //  await  this.afa.signOut(); 

    } catch (err) {
      this.handleError(err);
    }
  }

  // /**
  //  * General sign in mechanism to authenticate the users with a firebase project
  //  * using a traditional way, via username and password or by using an authentication provider
  //  * like google, facebook, twitter and github
  //  *
  //  * @param provider - the provider to authenticate with (google, facebook, twitter, github)
  //  * @param credentials optional email and password
  //  */
  // public async signInWith(provider: AuthProvider, credentials?: ICredentials) {
  //   try {
  //     let signInResult: UserCredential | any;

  //     switch (provider) {
  //       // case AuthProvider.ANONYMOUS:
  //       //   signInResult = (await this.afa.signInAnonymously()) as UserCredential;
  //       //   break;

  //       case AuthProvider.EmailAndPassword:
  //         signInResult = (await this.afa.signInWithEmailAndPassword(
  //           credentials.email,
  //           credentials.password
  //         )) as UserCredential;
  //         break;

  //       case AuthProvider.Google:
  //         signInResult = (await this.afa.signInWithPopup(
  //           googleAuthProvider
  //         )) as UserCredential;
  //         break;

  //       // case AuthProvider.Apple:
  //       //   signInResult = (await this.afa.signInWithPopup(
  //       //     appleAuthProvider
  //       //   )) as UserCredential;
  //       //   break;

  //       // case AuthProvider.Facebook:
  //       //   signInResult = (await this.afa.signInWithPopup(
  //       //     facebookAuthProvider
  //       //   )) as UserCredential;
  //       //   break;

  //       // case AuthProvider.Twitter:
  //       //   signInResult = (await this.afa.signInWithPopup(
  //       //     twitterAuthProvider
  //       //   )) as UserCredential;
  //       //   break;

  //       // case AuthProvider.Github:
  //       //   signInResult = (await this.afa.signInWithPopup(
  //       //     githubAuthProvider
  //       //   )) as UserCredential;
  //       //   break;

  //       // case AuthProvider.Microsoft:
  //       //   signInResult = (await this.afa.signInWithPopup(
  //       //     microsoftAuthProvider
  //       //   )) as UserCredential;
  //       //   break;

  //       // case AuthProvider.Yahoo:
  //       //   signInResult = (await this.afa.signInWithPopup(
  //       //     yahooAuthProvider
  //       //   )) as UserCredential;
  //       //   break;

  //       // case AuthProvider.PhoneNumber:
  //       //   // coming soon - see feature/sms branch
  //       //   break;

  //       default:
  //         throw new Error(
  //           `${AuthProvider[provider]} is not available as auth provider`
  //         );
  //     }
  //     await this.handleSuccess(signInResult);
  //   } catch (err) {
  //     this.handleError(err);
  //   }
  // }

  /**
   * Sign up new users via email and password.
   * After that the ngx-auth-firebaseui-user should verify and confirm an email sent via the firebase
   *
   * @param displayName - the displayName if the new ngx-auth-firebaseui-user
   * @param credentials email and password
   * @returns -
   */
  public async signUp(displayName: string, credentials: ICredentials) {
    try {
      const userCredential: UserCredential = await this.afa.createUserWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      let user = userCredential.user;
      if (user !== null) {
        user.sendEmailVerification();
        // Legacy fields
        this.emailConfirmationSent = true;
        this.emailToConfirm = credentials.email;
      }
    } catch (err) {
      this.handleError(err);
    }
  }

  // async sendNewVerificationEmail(user: firebase.user): Promise<void | never> {
  //   if (!this.user) {
  //     return Promise.reject(new Error("No signed in user"));
  //   }
  //   return this.user.sendEmailVerification();
  // }

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