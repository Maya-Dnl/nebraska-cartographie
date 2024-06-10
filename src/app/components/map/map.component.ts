import { Component, Input } from '@angular/core';
import L, { icon, LatLng, latLng, Layer, LeafletEvent, map, marker, tileLayer } from 'leaflet';
import { BuildingModel } from '../../services/building/building.model';
import { Router } from '@angular/router';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { BuildingService } from '../../services/building/building.service';
import { PopUpUserConfirmComponent, ModeConfirmPopup } from '../pop-ups/user-confirm-popup/popup-user-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { UserRole } from '../../store/models/user.model';

const initOptions = {
  layers: [
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 15, minZoom: 6 })
  ],
  zoom: 5,
  center: latLng(46.630765, 1.850898)
};

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})

export class MapComponent {

  // corner1 = L.latLng(40.712, -74.227);
  // corner2 = L.latLng(40.774, -74.125);
  // bounds = L.latLngBounds(this.corner1, this.corner2);

  layers: Layer[] = [];
  options: any = undefined;
  // userRole: UserRole = UserRole.nebraskaAdministrator;

  @Input() viewedBuilding: BuildingModel | undefined;
  @Input() buildingList: BuildingModel[] = [];
  @Input() selectedBuilding: BuildingModel | undefined;
  @Input() crossMode: boolean = false;

  constructor(
    private buildingService: BuildingService,
    private router: Router,
    private store: Store<AppState>,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.UpdateMap();
  }

  // ngOnChanges()
  // {
  //   console.log("ngOnChanges");
  //   this.UpdateMap();
  //   console.log(this.options);
  // }

  UpdateMap() {
    this.buildingList.forEach(building => {
      let size = 34;

      if (this.selectedBuilding != null && building.id === this.selectedBuilding.id) {
        size = 50;
      }

      let markerPoint = marker([building.generalInformations.latitude!, building.generalInformations.longitude!],
        {
          icon: icon({
            iconUrl: "assets/images/home_48dp.png",
            className: "marker-point",
            iconSize: [size, size],
          })
        });
      this.layers.push(markerPoint);
    });

    if (this.selectedBuilding != null) {
      this.options = {
        layers: [
          tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, minZoom: 5.5 })
        ],
        zoom: 10,
        center: latLng([this.selectedBuilding.generalInformations.latitude!, this.selectedBuilding.generalInformations.longitude!])
      };
    }
    else {
      this.options = initOptions;
    }
  }

  ClickMap(value: any) {
    if (this.crossMode === true) {
      let size = 34;
      let markerPoint = marker([value.latlng.lat, value.latlng.lng],
        {
          icon: icon({
            iconUrl: "assets/images/home_48dp.png",
            className: "marker-point",
            iconSize: [size, size],
          })
        })
        this.layers = [];
        this.layers.push(markerPoint);
    }
  }

  ValidPositionSelected() {
      const markerPoint: L.Marker<any> = this.layers[0] as L.Marker<any>;
      const latlng = markerPoint.getLatLng();

      const params = {
        latitude: latlng.lat,
        longitude: latlng.lng
      };
    
      this.router.navigate(['/new-building'], { queryParams: params });
  }
}
