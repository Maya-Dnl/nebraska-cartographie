import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure, FirebaseuiAngularLibraryService } from 'firebaseui-angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  firestore: Firestore = inject(Firestore)
  aCollection = collection(this.firestore, 'items')
  items$: Observable<any[]> = collectionData(this.aCollection);

  constructor(private firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService,
    private angularFireAuth: AngularFireAuth) {
    // firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
  }


  ngOnInit(): void {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        if (!user.emailVerified) {
          user.sendEmailVerification();
          this.logout();
          alert("Veuillez verifier votre email avant de vous connecter")
        }
      }
    }
    );
  }

  logout() {
    this.angularFireAuth.signOut();
  }

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult
  ) {
    console.log("successCallback", signInSuccessData)
  }

  errorCallback(errorData: FirebaseUISignInFailure
  ) {
    console.log("errorData", errorData)
  }

  uiShownCallback() {
    console.log("uiShownCallback")
  }
}
