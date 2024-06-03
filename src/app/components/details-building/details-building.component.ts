import { Component, Input, SimpleChange, ViewChild } from '@angular/core';
import { NgImageSliderComponent } from 'ng-image-slider';
// import { BuildingFormComponent } from '../../containers/building-form/building-form.component';
import { BConstructionWorks, BContacts, BGeneralInformations, BPictures, BuildingModel } from '../../services/building/building.model';
import { MatDialog } from '@angular/material/dialog';
import { BuildingService } from '../../services/building/building.service';
import { Router } from '@angular/router';
import { ModeConfirmPopup, PopUpUserConfirmComponent } from '../pop-ups/user-confirm-popup/popup-user-confirm.component';

@Component({
  selector: 'app-details-building',
  templateUrl: './details-building.component.html',
  styleUrl: './details-building.component.scss'
})
export class DetailsBuildingComponent {

  @Input() viewedBuilding: BuildingModel | undefined;


  GeneralInfo: BGeneralInformations | undefined = undefined;
  GeneralInfoIsEmpty: boolean | null = null;

  ConstructionW: BConstructionWorks | undefined = undefined;
  ConstructionWIsEmpty: boolean | null = null;

  Pictures: BPictures | undefined = undefined;
  PicturesIsEmpty: boolean | null = null;

  Contacts: BContacts | undefined = undefined;
  ContactsIsEmpty: boolean | null = null;

  constructor(public dialog: MatDialog, public buildingService: BuildingService, private router: Router) { }

  ngOnInit() {
    this.UpdateDetailObject();
  }

  ngOnChanges(Changes: SimpleChange) {
    this.UpdateDetailObject();
  }

  UpdateDetailObject() {
    this.GeneralInfo = this.viewedBuilding?.generalInformations;
    this.GeneralInfoIsEmpty = ObjectIsEmpty(this.GeneralInfo);

    this.ConstructionW = this.viewedBuilding?.constructionWorks;
    this.ConstructionWIsEmpty = ObjectIsEmpty(this.ConstructionW);

    this.Pictures = this.viewedBuilding?.pictures;
    this.PicturesIsEmpty = ObjectIsEmpty(this.Pictures);

    this.Contacts = this.viewedBuilding?.contacts;
    this.ContactsIsEmpty = ObjectIsEmpty(this.Contacts);
  }

  saveBuildingPreview() {
    if (this.viewedBuilding === undefined) {
      throw new Error("Aucune construction à sauvegarder !")
    }
    this.buildingService.SaveBuildingFromPreview(this.viewedBuilding).then(() => {
      this.buildingService.RemovePrevewBuilding();
      this.dialog.open(PopUpUserConfirmComponent, {
        width: '400px',
        backdropClass: 'backdrop-blur',
        panelClass: 'overlay-pop-up',
        data: { message: "Merci pour votre ajout. Votre construction est en attente de validation par l’association Nebraska. Vous serez tenus informé par e-mail.",
        modePopup: ModeConfirmPopup.Ok
         }
      }).afterClosed().subscribe(result => {
        this.router.navigateByUrl("my-buildings")
      });
    }, (reason) => {
      console.log(reason);
    })
  }

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

function ObjectIsEmpty(MyObject: object | undefined): boolean {

  if (MyObject == undefined) { return true; }

  let i = 0;

  Object.values(MyObject).forEach((v, _i) => {
    if (v != null || v != "") {
      i++;
    }
  });

  return i == 0;
}

