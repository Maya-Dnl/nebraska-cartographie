import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from './containers/home/home.component';
import { MainMapComponent } from './containers/main-map/main-map.component';
import { LogInComponent } from './containers/log-in/log-in.component';
import { BuildingFormComponent } from './containers/building-form/building-form.component';
import { DashboardAdminComponent } from './containers/dashboard-admin/dashboard-admin.component';

const routes: Routes = [
 {path: "log-in", component: LogInComponent, data: {title: 'Connexion ou inscription'}},
 {path: "main-map", component: MainMapComponent, data: {title: 'Recensement  des constructions en Paille Porteuse de France'}},
 {path: "new-building", component: BuildingFormComponent, data: {title: 'Référencement d’une nouvelle construction'}},
 {path: "my-buildings", component: MainMapComponent, data: {title: 'Mes constructions en Paille Porteuse'}},
 {path: "preview", component: MainMapComponent, data: {title: 'Les informations-sont elles correctes ?'}},
 {path: "preview/:id", component: MainMapComponent, data: {title: 'Les informations-sont elles correctes ?'}},
 {path: "dashboard-admin", component: DashboardAdminComponent, data: {title: 'Gestion administrateur'}},
 {path: "**", component: MainMapComponent, data: {title: 'Recensement des constructions en paille porteuse de France'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
