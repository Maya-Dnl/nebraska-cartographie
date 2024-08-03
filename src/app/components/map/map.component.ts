import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import L, { icon, LatLng, latLng, Layer, map, marker, tileLayer } from 'leaflet';
import { BuildingModel } from '../../services/building/building.model';
import { Router } from '@angular/router';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { BuildingService } from '../../services/building/building.service';
import { MatDialog } from '@angular/material/dialog';
import { PopUpUserConfirmComponent, ModeConfirmPopup } from '../pop-ups/user-confirm-popup/popup-user-confirm.component';

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
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  layers: Layer[] = [];
  options: any = initOptions;
  map: L.Map | undefined;

  @Input() viewedBuilding: BuildingModel | undefined;
  @Input() buildingList: BuildingModel[] | null = [];
  @Input() selectedBuilding: BuildingModel | undefined;
  @Input() selectedBuildingId : string |null = null;
  @Input() crossMode: boolean = false;

  @Output() onBuildingClicked = new EventEmitter<LatLng>();

  constructor(
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.UpdateMarkers();
  }

  ngOnChanges() {
    this.UpdateMarkers();
  }

  onMapReady(map: L.Map) {
    this.map = map;
    this.map.on('zoomend', () => {
      console.log("Current Zoom Level:", this.map?.getZoom());
      this.UpdateMarkers();
    });


    this.map.on('resize', (event) => {
      console.log("resize", event)
      this.CenterMap();
    });


    if (this.selectedBuilding) {
      this.map.setView(
        latLng([+this.selectedBuilding.generalInformations.latitude!, +this.selectedBuilding.generalInformations.longitude!]),
        this.map.getZoom()
      );
    }
  }

  CenterMap() {
    if (this.map) {
      this.map.invalidateSize();
      if (this.selectedBuilding) {
        this.map.setView(
          latLng([+this.selectedBuilding.generalInformations.latitude!, +this.selectedBuilding.generalInformations.longitude!]),
          this.map.getZoom()
        );
      } else {
        this.map.setView(initOptions.center, this.map.getZoom());
      }
    }
  }



  UpdateMarkers() {
    if (!this.map) return;

    // Clear existing layers
    this.layers.forEach(layer => this.map!.removeLayer(layer));
    this.layers = [];
    const currentZoom = this.map.getZoom();
    const baseSize = 4; // Taille de base des icônes

    if (this.buildingList) {
      this.buildingList.forEach(building => {
        let size = baseSize * currentZoom;

        let markerPoint: any = null;
        if (this.selectedBuilding && building === this.selectedBuilding) {
          markerPoint = marker([+building.generalInformations.latitude!, +building.generalInformations.longitude!], {
            icon: icon({
              iconUrl: "assets/images/home_48dp_select.png",
              className: "marker-point",
              iconSize: [45, 45],
            })
          });
        } else {
          markerPoint = marker([+building.generalInformations.latitude!, +building.generalInformations.longitude!], {
            icon: icon({
              iconUrl: "assets/images/home_48dp.png",
              className: "marker-point",
              iconSize: [size, size],
            })
          });
        }

        markerPoint.on("click", (e: any) => this.onMarkerClick(e, markerPoint));
        markerPoint.addTo(this.map!);
        this.layers.push(markerPoint);
      });


    }
  }

  onMarkerClick(e: L.LeafletMouseEvent, markerPoint: L.Marker<any>): void {
    this.onBuildingClicked.emit(markerPoint.getLatLng());
    setTimeout(() => {
      this.CenterMap();
    }, 500);
  }

  ClickMap(value: any) {
    if (this.crossMode === true) {

      if (this.map && this.map.getZoom() < 15) {
        this.map.setView(
          latLng([value.latlng.lat, value.latlng.lng]),
          this.map.getZoom()    
        );

        setTimeout(() => {
          if (this.map && this.map.getZoom() < 15) {
          this.map.zoomIn();
          }
        }, 200);


        
        // this.dialog.open(PopUpUserConfirmComponent, {
        //   width: '400px',
        //   backdropClass: 'backdrop-blur',
        //   panelClass: 'overlay-pop-up',
        //   data: {
        //     message: `Veuillez zoomer au maximum avant de placer votre repère.`,
        //     modePopup: ModeConfirmPopup.Ok
        //   }
        // })
        return;
      }


      const size = 34;
      const markerPoint = marker([value.latlng.lat, value.latlng.lng], {
        icon: icon({
          iconUrl: "assets/images/home_48dp.png",
          className: "marker-point",
          iconSize: [size, size],
        })
      });
      this.layers.forEach(layer => this.map!.removeLayer(layer));
      this.layers = [markerPoint];
      markerPoint.addTo(this.map!);
    } else {
      console.log(value);
    }
  }

  ValidPositionSelected() {
    const markerPoint: L.Marker<any> = this.layers[0] as L.Marker<any>;
    const latlng = markerPoint.getLatLng();

    if (this.map && this.map.getZoom() < 15) {
      this.dialog.open(PopUpUserConfirmComponent, {
        width: '400px',
        backdropClass: 'backdrop-blur',
        panelClass: 'overlay-pop-up',
        data: {
          message: `Veuillez zoomer au maximum avant de placer votre repère.`,
          modePopup: ModeConfirmPopup.Ok
        }
      })
      return;
    }

    if (this.selectedBuilding) {

      const params = {
        latitude: latlng.lat,
        longitude: latlng.lng,
      };

      this.router.navigate(['/edit-building/' + this.selectedBuildingId], { queryParams: params });
      return;
    }

    const params = {
      latitude: latlng.lat,
      longitude: latlng.lng,
    };

    this.router.navigate(['/new-building'], { queryParams: params });
  }
}
