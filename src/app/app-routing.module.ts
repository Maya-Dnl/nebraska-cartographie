import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import LogInComponent from './components/authentication/login.component';

const routes: Routes = [
 // {path: "login", component: LogInComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
