import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BuildingService } from '../../services/building/building.service';
import { BuildingModel } from '../../services/building/building.model';

@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss'
})
export class MainMapComponent {
  showFiller = false
  viewedBuilding: BuildingModel | null = null;
  opened = this.viewedBuilding != null;
  
  constructor(private router: Router, private buildingService: BuildingService)
  {}

  ngOnInit()
  {
   switch(this.router.url)
   {
    case "/":
      this.InitHomeMap();
      break;
    case "/preview":
      this.InitPreviewFromCache();
      break;
      default:
        this.InitPreviewFromServer();

   }
  }

  InitHomeMap()
  {

  }
  InitPreviewFromCache()
  {
    this.viewedBuilding = this.buildingService.GetPreviewBuilding();
    this.opened = true;
  }

  InitPreviewFromServer()
  {

  }

}
