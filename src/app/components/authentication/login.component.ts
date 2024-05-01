// import { Router } from '@angular/router';
// import { Component, OnInit } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/compat/auth';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: [],
// })
// export class LoginComponent implements OnInit {
//   constructor(private afAuth: AngularFireAuth, private router: Router) { }

//   ngOnInit(): void {}

//   successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
//     console.log('successCallback', data);
//     this.router.navigate(['/']);
//   }

//   errorCallback(data: FirebaseUISignInFailure) {
//     console.warn('errorCallback', data);
//   }

//   uiShownCallback() {
//     console.log('UI shown');
//   }
// }