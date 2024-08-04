import { Component} from '@angular/core';
import { Store } from '@ngrx/store';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure, FirebaseuiAngularLibraryService } from 'firebaseui-angular';
import { AppState } from './store/app.state';
import { changeTitle } from './store/global.actions';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthProcessService } from './services/authentication-service.service';
// import { selectApplicationMode } from './store/global.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public auth: AuthProcessService,
    private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.route.firstChild?.data.subscribe(r =>
          this.store.dispatch(changeTitle({ newTitle: r['title'] })))
      }
    });
  }
  
  // successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult
  // ) {
  //   console.log("successCallback", signInSuccessData)
  // }

  // errorCallback(errorData: FirebaseUISignInFailure
  // ) {
  //   console.log("errorData", errorData)
  // }

  // uiShownCallback() {
  //   console.log("uiShownCallback")
  // }
}