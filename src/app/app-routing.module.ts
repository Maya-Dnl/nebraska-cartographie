import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './containers/home/home.component';
//import LogInComponent from './components/authentication/login.component';

const routes: Routes = [
 // {path: "login", component: LogInComponent}
 {path: "*", component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
