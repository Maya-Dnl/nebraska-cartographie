import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingService } from '../../services/building/building.service';
import { BuildingModel } from '../../services/building/building.model';
import { MatDialog } from '@angular/material/dialog';
import { PopUpUserConfirmComponent, ModeConfirmPopup } from '../../components/pop-ups/user-confirm-popup/popup-user-confirm.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { selectApplicationMode } from '../../store/global.selectors';
import { ApplicationMode } from '../../store/global.reducer';

@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss'
})

export class MainMapComponent {

  filteredBuildingList: BuildingModel[] | undefined = undefined;
  selectedBuilding: BuildingModel | undefined = undefined;
  opened = false;



  constructor(
    private store: Store<AppState>,
    private router: Router,
    private buildingService: BuildingService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    // private renderer: Renderer2
  ) { }

  async ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    this.store.select(selectApplicationMode).subscribe(result => {
      if (result === ApplicationMode.GpsPointMode) {
        this.CleanMap()
      }
    });

    switch (this.router.url) {
      // display all published buildings | saved in Firebase
      case "/":
        this.InitHomeMap();
        break;
      // display in progress building before save in Firebase
      case "/preview":
        this.InitPreviewFromCache();
        break;
      // display waiting building saved in Firebase | Wait validation by Nebraska
      case "/preview/" + id:
        await this.InitPreviewFromServer(id);
        break;
      // display contributor's buildings
      case "/my-buildings":
        this.InitMyBuildings();
        break;
      default:
        this.router.navigateByUrl("/");
    }
  }

  CleanMap() {
    this.filteredBuildingList = [];
    this.selectedBuilding = undefined;
    this.opened = false;
    // this.renderer.setStyle(document.body, 'cursor', 'crosshair');
  }

  InitHomeMap() {
    this.filteredBuildingList = [];
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
      throw Error('id is null');
    }
    this.selectedBuilding = await this.buildingService.GetPreviewBuildingFromServer(id);
    if (this.selectedBuilding === undefined) {
      // afficher une popup pour indiquer que le building n'a pas ete trouvé avec un bouton continuer pour retour a la home
      this.dialog.open(PopUpUserConfirmComponent, {
        width: '400px',
        backdropClass: 'backdrop-blur',
        panelClass: ['overlay-pop-up', 'error-popup'],
        data: { message: "Aucune construction n'a été trouvé, cliquer sur Ok pour revenir sur la carte.", modePopup: ModeConfirmPopup.Ok }
      })
    }
    this.filteredBuildingList = [this.selectedBuilding!]
    this.opened = true;

  }

  InitMyBuildings() {

  }
}