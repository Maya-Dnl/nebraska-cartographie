import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
// import { getAuth, provideAuth } from '@angular/fire/auth';
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
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { NgImageSliderModule } from 'ng-image-slider';
import { environment } from '../environments/environment';
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { HomeComponent } from './containers/home/home.component';
import { MainMapComponent } from './containers/main-map/main-map.component';
import { HeadBarComponent } from './components/head-bar/head-bar.component';
import { MapComponent } from './components/map/map.component';
import { DetailsBuildingComponent } from './components/details-building/details-building.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LogInComponent } from './containers/log-in/log-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BuildingFormComponent } from './containers/building-form/building-form.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatBadgeModule } from '@angular/material/badge';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { PopUpMessageComponent } from './components/pop-up-message/pop-up-message.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DashboardAdminComponent } from './containers/dashboard-admin/dashboard-admin.component';






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
    HeadBarComponent,
    MapComponent,
    DetailsBuildingComponent,
    LogInComponent,
    BuildingFormComponent,
    UploadImageComponent,
    PopUpMessageComponent,
    DashboardAdminComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    LeafletModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatSidenavModule,
    MatButtonModule,
    MatStepperModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatBadgeModule,
    NgImageSliderModule,
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
      useValue: { googleAuthEnabled: true, emailAuthEnabled: true }
    },
    {
      provide: 'firebaseUIAuthConfig',
      useFactory: (config: any) => {

        // build firebase UI config object using settings from `config`

        const fbUiConfig: firebaseui.auth.Config = {
          signInFlow: 'popup',
          signInOptions: [],
          tosUrl: () => null,
          privacyPolicyUrl: () => null,
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
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    {
      provide: MAT_DATE_LOCALE, useValue: 'fr'
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
