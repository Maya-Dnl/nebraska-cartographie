import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BuildingService } from '../../services/building/building.service';
import { BuildingModel } from '../../services/building/building.model';

@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss'
})

export class MainMapComponent {


  filteredBuildingList: BuildingModel[] = [];
  selectedBuilding: BuildingModel | undefined = undefined;
  opened = false;

  constructor(private router: Router, private buildingService: BuildingService, private route: ActivatedRoute) { }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    switch (this.router.url) {
      case "/":
        this.InitHomeMap();
        break;
      case "/preview":
        this.InitPreviewFromCache();
        break;
      case "/preview/" + id:
        this.InitPreviewFromServer(id);
        break;
      default: 
        this.router.navigateByUrl("/");
    }
  }

  InitHomeMap() {

  }

  InitPreviewFromCache() {
    this.selectedBuilding = this.buildingService.GetPreviewBuildingFromCache();
    if (this.selectedBuilding === undefined) {
      this.router.navigateByUrl("/");
      return;
    }
    this.filteredBuildingList = [this.selectedBuilding!]
    this.opened = true;
  }

  async InitPreviewFromServer(id: string | null) {
    if (id === null) {
      throw Error ('id is null');
    }
    this.selectedBuilding = await this.buildingService.GetPreviewBuildingFromServer(id);
    if(this.selectedBuilding === undefined)
      {
       // afficher une popup pour indiquer que le building n'a pas ete trouvé avec un bouton continuer pour retour a la home
      }
      this.filteredBuildingList = [this.selectedBuilding!]
      this.opened = true;

  }
}