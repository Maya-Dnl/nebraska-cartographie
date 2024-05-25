import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure, FirebaseuiAngularLibraryService } from 'firebaseui-angular';
import { Observable } from 'rxjs';
import { AppState } from './store/app.state';
import { changeTitle } from './store/global.actions';
// import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { selectApplicationMode } from './store/global.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  // firestore: Firestore = inject(Firestore)
  // aCollection = collection(this.firestore, 'items')
  // items$: Observable<any[]> = collectionData(this.aCollection);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>) {
    // firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
  }

  ngOnInit(): void {

    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.route.firstChild?.data.subscribe(r =>
          this.store.dispatch(changeTitle({ newTitle: r['title'] })))
      }
    });

    // this.store.select(selectApplicationMode).subscribe(mode => {

    // })


    // this.angularFireAuth.authState.subscribe(user => {
    //   if (user) {
    //     if (!user.emailVerified) {
    //       user.sendEmailVerification();
    //       this.logout();
    //       alert("Veuillez verifier votre email avant de vous connecter")
    //     }
    //   }
    // }
    // );
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