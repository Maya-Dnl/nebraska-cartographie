import { Component, Input, SimpleChange, ViewChild, inject } from '@angular/core';
import { NgImageSliderComponent } from 'ng-image-slider';
// import { BuildingFormComponent } from '../../containers/building-form/building-form.component';
import { BConstructionWorks, BContacts, BGeneralInformations, BPictures, BuildingModel, PrivateBuildingData } from '../../services/building/building.model';
import { MatDialog } from '@angular/material/dialog';
import { BuildingService } from '../../services/building/building.service';
import { Router } from '@angular/router';
import { ModeConfirmPopup, PopUpUserConfirmComponent } from '../pop-ups/user-confirm-popup/popup-user-confirm.component';
import { FullMetadata, Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';

@Component({
  selector: 'app-details-building',
  templateUrl: './details-building.component.html',
  styleUrl: './details-building.component.scss'
})
export class DetailsBuildingComponent {

  @Input() viewedBuilding: BuildingModel | undefined;


  private readonly storage: Storage = inject(Storage);

  imageObject: Array<object> = [];

  imageSizeObject = { width: 445, height: 360, space: 75 }
  //autoSlideObject = { interval: 5, stopOnHover: false }

  autoSlideObject = { interval: 0, stopOnHover: false }

  pictureReady = false;
  picturesReady = [false];
  // imageSizeObject = { width: 600, height: 400, space: 0 }
  // autoSlideObject = { interval: 5, stopOnHover: false }

  GeneralInfo: BGeneralInformations | undefined = undefined;
  GeneralInfoIsEmpty: boolean | null = null;

  ConstructionW: BConstructionWorks | undefined = undefined;
  ConstructionWIsEmpty: boolean | null = null;

  Pictures: BPictures[] | undefined = undefined;
  PicturesIsEmpty: boolean | null = null;

  Contacts: BContacts | undefined = undefined;
  ContactsIsEmpty: boolean | null = null;

  Private: PrivateBuildingData | undefined = undefined;
  PrivateIsEmpty: boolean | null = null;

  constructor(
    public dialog: MatDialog,
    public buildingService: BuildingService,
    private router: Router) { }

  ngOnInit() {
    this.UpdateDetailObject();
  }

  ngOnChanges(Changes: SimpleChange) {
    this.UpdateDetailObject();
    this.GetPictures();
  }

  UpdateDetailObject() {
    console.log("Update");
    this.GeneralInfo = this.viewedBuilding?.generalInformations;
    this.GeneralInfoIsEmpty = ObjectIsEmpty(this.GeneralInfo);

    this.ConstructionW = this.viewedBuilding?.constructionWorks;
    this.ConstructionWIsEmpty = ObjectIsEmpty(this.ConstructionW);

    this.Contacts = this.viewedBuilding?.contacts;
    this.ContactsIsEmpty = ObjectIsEmpty(this.Contacts);

    this.Private = this.viewedBuilding?.private;
    this.PrivateIsEmpty = ObjectIsEmpty(this.Private);
  }

  GetPictures() {
    console.log("GetPicture");
    this.Pictures = this.viewedBuilding?.pictures;
    this.PicturesIsEmpty = false; // Always display picture

    this.pictureReady = false;
    this.picturesReady = []

    if (this.Pictures !== undefined && this.Pictures.length > 0) {
      console.log("PICTURE IS PRESENT", this.Pictures.length);
      console.log(this.Pictures);
      let index: number = 0;
      this.Pictures.forEach(picture => {
        this.imageObject.push({
          image: 'assets/images/360_F_435592117assets_q7GtFAXFiKdxygr8qNOcNy79wzax89Qp.jpg',
          thumbImage: 'assets/images/360_F_435592117_q7GtFAXFiKdxygr8qNOcNy79wzax89Qp.jpg',
          alt: 'No picture for this building',
          order: index
        })
        this.picturesReady.push(false);
        index++;
      })
      this.Pictures.forEach(picture => {
        this.GetPictureUrl(+picture.index, this.viewedBuilding?.filesId!).then(pictureUrl => {
          console.log(pictureUrl);
          console.log(picture);
          this.imageObject[+picture.index] =
          {
            image: pictureUrl,
            thumbImage: pictureUrl,
            alt: picture.alt,
            order: picture.index
          }
          console.log(this.imageObject);
        }).finally(() => {
          this.picturesReady[+picture.index] = true;
          console.log(this.picturesReady)
          this.pictureReady = this.picturesReady.every(p => p === true)
        });
      })
    } else {
      console.log("NO PICTURE !!");
      this.imageObject = [];
      this.imageObject.push({
        image: 'assets/images/360_F_435592117assets_q7GtFAXFiKdxygr8qNOcNy79wzax89Qp.jpg',
        thumbImage: 'assets/images/360_F_435592117_q7GtFAXFiKdxygr8qNOcNy79wzax89Qp.jpg',
        alt: 'No picture for this building',
        order: 0
      })
      setTimeout(() => {
        this.pictureReady = true;
      }, 200);
    
    }
  }




  // Method to get the URL of a saved picture
  async GetPictureUrl(index: number, buildingId: string): Promise<string> {
    // Construct the file path based on the index and buildingId
    const folderPath = `${buildingId}/`;
    const fileName = `${buildingId!}-${index}.jpeg`;
    const filePath = folderPath + fileName;

    // Create a reference to the file in Firebase Storage
    const storageRef = ref(this.storage, filePath);

    try {
      // Get the download URL
      const url = await getDownloadURL(storageRef);
      console.log(`Download URL for image ${index}: ${url}`);
      return url;
    } catch (error) {
      console.error("Error getting download URL", error);
      throw error;
    }
  }

  // saveBuildingPreview() {
  //   if (this.viewedBuilding === undefined) {
  //     throw new Error("Aucune construction à sauvegarder !")
  //   }
  //   this.buildingService.SaveBuildingFromPreview(this.viewedBuilding).then(() => {
  //     this.buildingService.RemovePrevewBuilding();
  //     this.dialog.open(PopUpUserConfirmComponent, {
  //       width: '400px',
  //       backdropClass: 'backdrop-blur',
  //       panelClass: 'overlay-pop-up',
  //       data: { message: "Merci pour votre ajout. Votre construction est en attente de validation par l’association Nebraska. Vous serez tenus informé par e-mail.",
  //       modePopup: ModeConfirmPopup.Ok
  //        }
  //     }).afterClosed().subscribe(result => {
  //       this.router.navigateByUrl("my-buildings")
  //     });
  //   }, (reason) => {
  //     console.log(reason);
  //   })
  // }

  @ViewChild('nav') slider: NgImageSliderComponent | undefined;



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

