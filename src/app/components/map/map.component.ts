import { Component, Input } from '@angular/core';
import L, { circle, icon, latLng, LatLngBounds, Layer, marker, polygon, tileLayer } from 'leaflet';
import { BuildingModel } from '../../services/building/building.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})

export class MapComponent {
  
  corner1 = L.latLng(40.712, -74.227);
  corner2 = L.latLng(40.774, -74.125);
  bounds = L.latLngBounds(this.corner1, this.corner2);


  // fitBounds: LatLngBounds | undefined = ;
  
  @Input() buildingList: BuildingModel[] = [];
  @Input() selectedBuilding: BuildingModel | null = null;

  layers: Layer[] = [];

constructor() {}

  ngOnInit()
  {
    this.UpdateMap();
  }

  UpdateMap()
  {
    this.buildingList.forEach(building => {
      let size = 34;

      if(this.selectedBuilding != null && building.id === this.selectedBuilding.id) {
        size = 50;
      }

      let markerPoint = marker([building.generalInformations.latitude!, building.generalInformations.longitude!],
        {icon: icon({
          iconUrl: "assets/images/home_48dp.png",
          className: "marker-point",
          iconSize: [size, size],
        })});
        this.layers.push(markerPoint)
    });
    
    if(this.selectedBuilding != null) {
      this.options = {
        layers: [
          tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, minZoom: 5.5})
        ],
        zoom: 10,
        center: latLng([this.selectedBuilding.generalInformations.latitude!, this.selectedBuilding.generalInformations.longitude!])
      };
    }
  }

  ClickMap(value: any)
  {
    console.log(value);
    // L.marker([latitude, -0.09], {icon: marker}).addTo(map);
  }

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, minZoom: 5.5})
    ],
    zoom: 5,
    center: latLng(46.5, 2)
  };
}
