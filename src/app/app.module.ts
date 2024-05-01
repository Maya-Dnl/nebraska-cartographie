import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {
  provideFirestore,
  // getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule} from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { environment } from '../environments/environment';
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { HomeComponent } from './containers/home/home.component';
import { MainMapComponent } from './components/main-map/main-map.component';
import { HeadBarComponent } from './components/head-bar/head-bar.component';


const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // {
    //   scopes: [
    //     'public_profile',
    //     'email',
    //     'user_likes',
    //     'user_friends'
    //   ],
    //   customParameters: {
    //     'auth_type': 'reauthenticate'
    //   },
    //   provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    // },
    // {
    //   requireDisplayName: false,
    //   provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    // },
    // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
};


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainMapComponent,
    HeadBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
  //  provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
   // provideFirestore(() => getFirestore())
    provideFirestore(() => initializeFirestore(getApp(), {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    })),
  ],
  providers: [
    {
      provide: 'appConfig',
      useValue: {googleAuthEnabled: true, emailAuthEnabled: true}
    },
    {
      provide: 'firebaseUIAuthConfig',
      useFactory: (config: any) => {
  
        // build firebase UI config object using settings from `config`
  
        const fbUiConfig: firebaseui.auth.Config = {
          signInFlow: 'popup',
          signInOptions: [],
          tosUrl: () => null,
          privacyPolicyUrl:  () => null,
          credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
        };
  
        if (config.googleAuthEnabled) {
          fbUiConfig.signInOptions!.push(firebase.auth.GoogleAuthProvider.PROVIDER_ID);
        }
  
        if (config.emailAuthEnabled) {
          fbUiConfig.signInOptions!.push({
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false,
            signInMethod: firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
          });
        }
  
        // other providers as needed
  
        return fbUiConfig;
      },
      deps: ['appConfig']
    },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
