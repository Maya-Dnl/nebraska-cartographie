import '@firebase/auth';
import { EventEmitter, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { userLogInSuccess, userLogOutSuccess } from '../store/global.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { UserRole } from '../store/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { getAuth, fetchSignInMethodsForEmail } from "firebase/auth";


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

  public AuthReady: boolean = false;

  constructor(
    public afa: AngularFireAuth,
    private store: Store<AppState>,
    public dialog: MatDialog
  ) {
    this.afa.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch((error) => {
      console.error('Failed to set persistence:', error);
    });

    this.afa.authState.subscribe((user) => {
      if (user) {
        console.log('User signed in:', user);
        this.UpdateStateAfterLogin(user!);
        this.AuthReady = true;
      } else {
        console.log('User signed out');
        this.AuthReady = true;
      }
    });
  }

  /**
   * Reset password for a user via email.
   *
   * @param email The email address of the user
   * @returns Promise<void>
   */
  public async resetPassword(email: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.afa.sendPasswordResetEmail(email);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Savoir si le mail est deja connu de firebase
   * @param email l'email de l'utilisateur
   * @returns true si deja connu sinon false
   */
  public async signInTestEmailExist(email: string): Promise<boolean | null> {
    const auth = getAuth();
    return fetchSignInMethodsForEmail(auth, email)
      .then((signInMethods) => {
        console.log(signInMethods);
        if (signInMethods.includes('password')) {
          console.log('Le fournisseur de connexion par mot de passe est activé pour cet email.');
          return true;
        } else {
          console.log('Le fournisseur de connexion par mot de passe n\'est pas activé pour cet email.');
          return false;
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des méthodes de connexion :', error);
        return null;
      });

  }



  /**
   * Sign in users via email and password.
   * 
   * @param credentials email and password
   * @returns Promise<SignInResult>
   */
  public async signInWith(credentials: ICredentials): Promise<SignInResult> {
    return new Promise<SignInResult>(async (resolve, reject) => {
      try {
        const userCredential: UserCredential = await this.afa.signInWithEmailAndPassword(
          credentials.email,
          credentials.password
        );

        const user = userCredential.user;
        if (user && !user.emailVerified) {
          resolve(SignInResult.emailNotVerified);
        } else {

          this.UpdateStateAfterLogin(user!);
          resolve(SignInResult.signInSuccess);
        }
      } catch (error: any) {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code ===   'auth/invalid-credential') {
          resolve(SignInResult.wrongCredentials);
        } else if (error.code === 'auth/too-many-requests') {
          resolve(SignInResult.tooManyRequests);
        } else {
          reject(error); // Pour les autres erreurs, rejetez la promesse
        }
      }
    });
  }

  private UpdateStateAfterLogin(user: firebase.User)
  {
    let role: UserRole

    switch (user?.email) {
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
        id: user?.uid!,
        mail: user?.email!,
        creationDate: user?.metadata.creationTime!,
        role: role
      }
    }));
  }

  /**
   * Sign up new users via email and password.
   * After that the ngx-auth-firebaseui-user should verify and confirm an email sent via the firebase
   *
   * @param credentials email and password
   * @returns Promise<void>
   */
  public async signUp(credentials: ICredentials): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const userCredential: UserCredential = await this.afa.createUserWithEmailAndPassword(
          credentials.email,
          credentials.password
        );

        const user = userCredential.user;
        if (user) {
          await user.sendEmailVerification();
          await this.signOut();
          resolve();
        } else {
          reject(new Error('User creation failed'));
        }
      } catch (error) {
        reject(error);
      }
    });
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