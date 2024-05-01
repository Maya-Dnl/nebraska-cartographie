import { Component } from '@angular/core';
import { latLng, tileLayer } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  // corner1 = L.latLng(40.712, -74.227),
  // corner2 = L.latLng(40.774, -74.125),
  // bounds = L.latLngBounds(corner1, corner2)

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, minZoom: 6 })
    ],
    zoom: 6,
    center: latLng(46.5, 2)
  };
}
