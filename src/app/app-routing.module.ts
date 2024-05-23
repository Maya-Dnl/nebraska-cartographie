import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from './containers/home/home.component';
import { MainMapComponent } from './containers/main-map/main-map.component';
import { LogInComponent } from './containers/log-in/log-in.component';
import { BuildingFormComponent } from './containers/building-form/building-form.component';
import { DashboardAdminComponent } from './containers/dashboard-admin/dashboard-admin.component';

const routes: Routes = [
 {path: "log-in", component: LogInComponent, data: {title: 'Connexion ou inscription'}},
 {path: "main-map", component: MainMapComponent, data: {title: 'Home'}},
 {path: "new-building", component: BuildingFormComponent, data: {title: 'Nouvelle const'}},
 {path: "preview", component: MainMapComponent, data: {title: 'Preview nouvelle construction'}},
 {path: "preview/:id", component: MainMapComponent, data: {title: 'Preview construction'}},
 {path: "dashboard-admin", component: DashboardAdminComponent, data: {title: 'dash ou inscription'}},
 {path: "**", component: MainMapComponent, data: {title: 'Home'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
