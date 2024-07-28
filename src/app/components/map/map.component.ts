import { Component, EventEmitter, Input, Output } from '@angular/core';
import L, { icon, LatLng, latLng, Layer, LeafletEvent, map, marker, tileLayer } from 'leaflet';
import { BuildingModel } from '../../services/building/building.model';
import { Router } from '@angular/router';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { BuildingService } from '../../services/building/building.service';
import { MatDialog } from '@angular/material/dialog';

const initOptions = {
  layers: [
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 15, minZoom: 5.5 })
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
  @Input() buildingList: BuildingModel[] | null = [];
  @Input() selectedBuilding: BuildingModel | undefined;
  @Input() crossMode: boolean = false;

  @Output() onBuildingClicked = new EventEmitter<LatLng>();

  constructor(
    private buildingService: BuildingService,
    private router: Router,
    private store: Store<AppState>,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.UpdateMap();
  }

  ngOnChanges()
  {
    console.log("ngOnChanges map");
    this.UpdateMap();
    console.log(this.options);
  }

  UpdateMap() {
    this.layers = [];
    if (this.buildingList) {
      this.buildingList.forEach(building => {
        let size = 34;

        if (this.selectedBuilding != null && building.id === this.selectedBuilding.id) {
          size = 50;
        }

        let markerPoint = marker([+building.generalInformations.latitude!, +building.generalInformations.longitude!],
          {
            icon: icon({
              iconUrl: "assets/images/home_48dp.png",
              className: "marker-point",
              iconSize: [size, size],
            })
          });
          markerPoint.on("click", (e) => this.onMarkerClick(e, markerPoint))
        this.layers.push(markerPoint);
      });

      if (this.selectedBuilding != null) {
        this.options = {
          layers: [
            tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 15, minZoom: 5.5 })
          ],
          zoom: 10,
          center: latLng([+this.selectedBuilding.generalInformations.latitude!, +this.selectedBuilding.generalInformations.longitude!])
        };
      }
      else {
        this.options = initOptions;
      }
    }
  }
  onMarkerClick(e: L.LeafletMouseEvent, markerPoint: L.Marker<any>): void {
    this.onBuildingClicked.emit(markerPoint.getLatLng());
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
    }else{
      console.log(value);
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
