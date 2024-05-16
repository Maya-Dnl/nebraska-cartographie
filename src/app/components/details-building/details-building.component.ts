import { Component, Input, ViewChild } from '@angular/core';
import { NgImageSliderComponent } from 'ng-image-slider';
import { BuildingFormComponent } from '../../containers/building-form/building-form.component';
import { BuildingModel } from '../../services/building/building.model';

@Component({
  selector: 'app-details-building',
  templateUrl: './details-building.component.html',
  styleUrl: './details-building.component.scss'
})
export class DetailsBuildingComponent {

  @Input() viewedBuilding: BuildingModel | null = null;


  @ViewChild('nav') slider: NgImageSliderComponent | undefined;

  imageObject: Array<object> = [{
    image: 'assets/images/interieur-maison-liberation.jpeg',
    thumbImage: 'assets/images/interieur-maison-liberation.jpeg',
    alt: 'alt of image',
    //  title: 'interieur-maison'
    order: 1
  }, {
    image: 'assets/images/isolation-paille.png',
    thumbImage: 'assets/images/isolation-paille.png',
    //  title: 'isolation-paille',
    alt: 'Image alt',
    order: 2
  }
  ];
  imageSizeObject = { width: 600, height: 400, space: 0 }
  autoSlideObject = { interval: 5, stopOnHover: false }

  prevImageClick() {
      this.slider!.prev();
  }

  nextImageClick() {
      this.slider!.next();
  }
}
