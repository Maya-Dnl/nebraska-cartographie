import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingService } from '../../services/building/building.service';
import { BuildingModel } from '../../services/building/building.model';
import { MatDialog } from '@angular/material/dialog';
import { PopUpUserConfirmComponent, ModeConfirmPopup } from '../../components/pop-ups/user-confirm-popup/popup-user-confirm.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { selectUser } from '../../store/global.selectors';
import { firstValueFrom, lastValueFrom, Observable, of } from 'rxjs';
import { UserModel, UserRole } from '../../store/models/user.model';
import { LatLng } from 'leaflet';


@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.html',
  styleUrl: './main-map.component.scss'
})

export class MainMapComponent {


  filteredBuildingList$: Observable<BuildingModel[]> | undefined = undefined;

  selectedBuilding: BuildingModel | undefined = undefined;
  opened = false;
  mainMapMode: MainMapMode | undefined = undefined;

  public userRole = UserRole;
  public MainMapMode = MainMapMode;

  selectedBuildingId: null | string = null;

  user$: Observable<UserModel | null> = this.store.select(selectUser)
  private userId: string | undefined;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private buildingService: BuildingService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {

    this.selectedBuildingId = this.route.snapshot.paramMap.get('id');



    this.user$.subscribe(user => {
      this.userId = user?.id
    })

    switch (this.router.url) {
      // display all published buildings | saved in Firebase
      case "/home-map":
        this.InitHomeMap();
        break;
      // display all published buildings when we click on map icon
      case "/select-map":
        this.InitSelectMap();
        break;
      case "/select-map/" + this.selectedBuildingId:
        this.EditSelectMap(this.selectedBuildingId!);
        break;
      // display in progress building before save in Firebase
      case "/preview":
        this.InitPreviewFromCache();
        break;
      // display waiting building saved in Firebase | Wait validation by Nebraska
      case "/preview/" + this.selectedBuildingId:
        await this.InitPreviewFromServer(this.selectedBuildingId);
        break;
      // display contributor's buildings
      case "/my-buildings":
        this.InitMyBuildings();
        break;
      default:
        this.router.navigateByUrl("/home-map");
    }

    // this.filteredBuildingList$!.subscribe(value => this.filteredBuildingList = value);
  }

  CleanMap() {
    setTimeout(() => {
      this.filteredBuildingList$ = of([]);
      this.selectedBuilding = undefined;
      this.opened = false;
    }, 100);

  }

  onDrawerToggle() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 30); // Vous pouvez ajuster ce délai si nécessaire
  }

  InitHomeMap() {
    this.mainMapMode = MainMapMode.homeMapMode;
    setTimeout(() => {
      this.filteredBuildingList$ = this.buildingService.getPublishedBuildings();
    }, 100);
  }

  InitSelectMap() {
    this.mainMapMode = MainMapMode.selectMapMode;
    setTimeout(() => {
      this.filteredBuildingList$ = of([]);
    }, 100);
  }

  async EditSelectMap(id: string) {
    this.mainMapMode = MainMapMode.selectMapMode;
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
      }).afterClosed().subscribe(async result => {
        if (result === true) {
          this.router.navigateByUrl("home-map")
        }
      });
    }
    setTimeout(() => {
      this.filteredBuildingList$ = of([this.selectedBuilding!])
      this.opened = true;
    }, 100);
  }

  InitPreviewFromCache() {
    this.mainMapMode = MainMapMode.previewCacheMode;
    this.selectedBuilding = this.buildingService.GetPreviewBuildingFromCache();
    if (this.selectedBuilding === undefined) {
      this.router.navigateByUrl("/");
      return;
    }
    setTimeout(() => {
      this.filteredBuildingList$ = of([this.selectedBuilding!])
      this.opened = true;
    }, 100);
  }

  async InitPreviewFromServer(id: string | null) {
    this.mainMapMode = MainMapMode.previewServerMode;
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
      }).afterClosed().subscribe(async result => {
        if (result === true) {
          this.router.navigateByUrl("home-map")
        }
      });
    }
    setTimeout(() => {
      this.filteredBuildingList$ = of([this.selectedBuilding!])
      this.opened = true;
    }, 100);
  }

  InitMyBuildings() {
    this.mainMapMode = MainMapMode.myBuildingsMode;
    setTimeout(() => {
      this.filteredBuildingList$ = this.buildingService.getAllBuildingsByOwner(this.userId!);
    }, 100);
  }

  saveBuildingPreview() {
    if (this.selectedBuilding === undefined) {
      throw new Error("Aucune construction à sauvegarder !")
    }
    this.buildingService.SaveBuildingFromPreview(this.selectedBuilding).then(() => {
      this.buildingService.RemovePrevewBuilding();
      this.dialog.open(PopUpUserConfirmComponent, {
        width: '400px',
        backdropClass: 'backdrop-blur',
        panelClass: 'overlay-pop-up',
        data: {
          message: "Merci pour votre ajout. Votre construction est en attente de validation par l’association Nebraska 😄",
          modePopup: ModeConfirmPopup.Ok
        }
      }).afterClosed().subscribe(result => {
        this.router.navigateByUrl("my-buildings")
      });
    }, (reason) => {
      console.log(reason);
    })
  }

  publishBuilding() {
    this.buildingService.publishBuilding(this.selectedBuildingId!)
    this.dialog.open(PopUpUserConfirmComponent, {
      width: '400px',
      backdropClass: 'backdrop-blur',
      panelClass: 'overlay-pop-up',
      data: {
        message: "Félicitation ! Cette nouvelle construction est inscrite sur la carte de référencement ! 🎊",
        modePopup: ModeConfirmPopup.Ok
      }
    }).afterClosed().subscribe(result => {
      this.router.navigateByUrl("dashboard-admin")
    });
  }

  onBuildingClicked($event: LatLng) {
    console.log($event)
    firstValueFrom(this.filteredBuildingList$!).then(value => {
      console.log(value);
      this.selectedBuilding = value.find(b =>
        b.generalInformations.latitude == $event.lat.toString()
        && b.generalInformations.longitude == $event.lng.toString())
    })
    this.opened = true;
  }
}

export enum MainMapMode {
  homeMapMode = 0,
  selectMapMode = 1,
  previewCacheMode = 2,
  previewServerMode = 3,
  myBuildingsMode = 4
}

