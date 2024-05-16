import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './containers/home/home.component';
import { MainMapComponent } from './containers/main-map/main-map.component';
import { LogInComponent } from './containers/log-in/log-in.component';
import { BuildingFormComponent } from './containers/building-form/building-form.component';

const routes: Routes = [
 {path: "log-in", component: LogInComponent},
 {path: "main-map", component: MainMapComponent},
 {path: "new-building", component: BuildingFormComponent},
 {path: "preview", component: MainMapComponent},
 {path: "preview/:id", component: MainMapComponent},
 {path: "**", component: MainMapComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
