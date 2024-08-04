import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from './containers/home/home.component';
import { MainMapComponent } from './containers/main-map/main-map.component';
import { LogInComponent } from './containers/log-in/log-in.component';
import { BuildingFormComponent } from './containers/building-form/building-form.component';
import { DashboardAdminComponent } from './containers/dashboard-admin/dashboard-admin.component';
import { TechnicalAdminComponent } from './containers/technical-admin/technical-admin.component';
import { AuthGuard } from './auth.guards';

const routes: Routes = [
 {path: "log-in", component: LogInComponent},
 {path: "home-map", component: MainMapComponent, data: {title: 'Référencement des constructions en Paille Porteuse de France'}},
 {path: "select-map/:id", component: MainMapComponent, data: {title: 'Veuillez modifier la position de votre construction'}},
 {path: "select-map", component: MainMapComponent, data: {title: 'Veuillez sélectionner la position de votre construction'}},
 {path: "new-building", component: BuildingFormComponent, data: {title: 'Référencement d’une nouvelle construction'}},
 {path: "edit-building/:id", component: BuildingFormComponent, data: {title: 'Edition d’une construction'}},
 {path: "my-buildings", component: MainMapComponent, data: {title: 'Mes constructions en Paille Porteuse'}, canActivate: [AuthGuard]},
 {path: "preview", component: MainMapComponent, data: {title: 'Les informations sont-elles correctes ?'}},
 {path: "preview/:id", component: MainMapComponent, data: {title: 'Les informations sont-elles correctes ?'}},
 {path: "dashboard-admin", component: DashboardAdminComponent, data: {title: 'Gestion administrateur'}},
 {path: "technical-admin", component: TechnicalAdminComponent, data: {title: 'Gestion dev administrateur'}},
 {path: "**", redirectTo: "home-map" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
