import { Component, Inject, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { BPictures, BuildingModel, BuildingStatus } from '../../services/building/building.model';
import { BuildingService } from '../../services/building/building.service';
import { ActivatedRoute, Router } from '@angular/router';
import { __param } from 'tslib';
import { v4 as uuidv4 } from 'uuid';
import { SavedPictureEventType } from '../../components/upload-image/upload-image.component';
import { MatDialog } from '@angular/material/dialog';
import { ModeConfirmPopup, PopUpUserConfirmComponent } from '../../components/pop-ups/user-confirm-popup/popup-user-confirm.component';
import { selectUser } from '../../store/global.selectors';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-building-form',
  templateUrl: './building-form.component.html',
  styleUrl: './building-form.component.scss'
})


export class BuildingFormComponent {

  maxDate = new Date();
  // tempId = Date.now().toString();
  fileId: string | undefined = undefined;
  user$ = this.store.select(selectUser);

  userId: string | undefined = undefined;
  generalInformationsFormGroup: FormGroup | undefined = undefined

  constructionUseOptions: string[] = ['Logement collectif', 'Logement individuel', 'Logement individuel groupé', 'Bâtiment administratif', 'Bâtiment commercial', 'Bâtiment industriel', 'Bâtiment de loisirs', 'Bâtiment de santé', 'Bâtiment de retraite', 'Bâtiment éducatif', 'Bâtiment socio-culturel', 'Bâtiment agricole', 'Ouvrage exeptionnel', 'autre'];
  selfConstructionOptions: string[] = ['Oui', 'Non', 'Partiel'];
  participatoryConstructionOptions: string[] = ['Oui', 'Non', 'Partiel'];
  complementaryStructureOptions: string[] = ['Oui', 'Non'];
  natureComplementaryStructureOptions: string[] = ['Bois', 'Béton armé', 'Métal', 'Maconnerie (brique, parpaing, pierre..)', 'Autre'];
  strawBaleSizeOptions: string[] = ['Petites bottes', 'Bottes matelas', 'Grosses bottes', 'Autre'];
  typeOfInstallationOptions: string[] = ['À plat', 'Sur chants'];
  cerealsUsedOptions: string[] = ['Blé', 'Orge', 'Avoine', 'Seigle', 'Triticale', 'Riz', 'Autre'];
  calculationNoteOptions: string[] = ['Oui', 'Non'];
  arrayIntegrationOptions: string[] = ['Pré-cadre flottant', 'Elément coulissant', 'Elément fixe (poteau, montant, ..)', 'Autre'];
  natureInkingSupportOptions: string[] = ['Bois', 'Béton armé', 'Métal', 'Maconnerie (brique, parpaing, pierre..)', 'Autre'];
  interiorCoveringOptions: string[] = ['Plaque de plâtre', 'Lambris', 'Enduit terre', 'Enduit chaux', 'Enduit terre et chaux', 'Enduit plâtre', 'Autre'];
  exteriorCoveringOptions: string[] = ['Bardage ventilé', 'Enduit terre', 'Enduit chaux', 'Enduit terre et chaux', 'Enduit plâtre', 'Panneau', 'Autre'];


  constructionWorksFormGroup: FormGroup | undefined = undefined;

  selectWorks = this.formBuilder.group({
    neuf: [false],
    extension: [false],
    renovation: [false],
    isolationExt: [false],
    isolationInt: [false]
  });

  picturesFormGroup: FormGroup | undefined = undefined;
  tempPictures: BPictures[] = [];
  contactsFormGroup: FormGroup | undefined = undefined;
  privateFormGroup: FormGroup | undefined = undefined;
  editedBuildingId: string | undefined | null = undefined;

  editedBuilding: BuildingModel | undefined | null = undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private buildingService: BuildingService,
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    public dialog: MatDialog,

    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {
    this._adapter.setLocale(this._locale);
  }

  async ngOnInit() {

    let userMail: string | undefined;

    this.user$.subscribe(user => {
      userMail = user?.mail
      this.userId = user?.id
    })


    this.editedBuilding = this.buildingService.GetPreviewBuildingFromCache();

    this.editedBuildingId = this.route.snapshot.paramMap.get('id');
    if (this.editedBuildingId != null) {
      this.editedBuilding = await this.buildingService.GetPreviewBuildingFromServer(this.editedBuildingId)
      if (this.editedBuilding === undefined) {
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
    }


    this.fileId = this.editedBuilding != null ? this.editedBuilding.filesId : uuidv4();
    let latitude = undefined;
    let longitude = undefined;

    this.route.queryParams.subscribe(params => {
      latitude = params['latitude'];
      longitude = params['longitude'];
    });

    let gi = this.editedBuilding != null ? this.editedBuilding.generalInformations : null;



    // Conditon ? si oui : si non 
    this.generalInformationsFormGroup = this.formBuilder.group({
      buildingName: [gi ? gi.buildingName : '', Validators.required],
      address: [gi ? gi.address : ''],
      cityOrTown: [gi ? gi.cityOrTown : '', Validators.required],
      latitude: [latitude ? latitude : (gi ? gi.latitude : ""), [Validators.required, Validators.max(51.2), Validators.min(41.2)]],
      longitude: [longitude ? longitude : (gi ? gi.longitude : ""), [Validators.required, Validators.max(8.3), Validators.min(-5.2)]],
      constructionUse: [gi ? gi.constructionUse : '', Validators.required],
      infosConstructionUse: [gi ? gi.infosConstructionUse : ''],
      totalCostOfWork: [gi ? gi.totalCostOfWork : ''],
      buildingSurface: [gi ? gi.buildingSurface : '', Validators.required],
      numberOfLevels: [gi ? gi.numberOfLevels : '', Validators.required],
    });

    let cw = this.editedBuilding != null ? this.editedBuilding.constructionWorks : null;

    this.constructionWorksFormGroup = this.formBuilder.group({
      startDate: [cw ? cw.startDate : '', Validators.required],
      endDate: [cw ? cw.endDate : ''],
      strawBaleSize: [cw ? cw.strawBaleSize : '', Validators.required],
      strawBaleInfos: [cw ? cw.strawBaleInfos : ''],
      typeOfInstallation: [cw ? cw.typeOfInstallation : ''],
      strawBaleDensity: [cw ? cw.strawBaleDensity : ''],
      cerealsUsed: [cw ? cw.cerealsUsed : ''],
      supplyDistance: [cw ? cw.supplyDistance : ''],
      selfConstruction: [cw ? cw.selfConstruction : '', Validators.required],
      participatoryConstruction: [cw ? cw.participatoryConstruction : '', Validators.required],
      complementaryStructure: [cw ? cw.complementaryStructure : ''],
      natureComplementaryStructure: [cw ? cw.natureComplementaryStructure : ''],
      infosNatureComplementaryStructure: [cw ? cw.infosNatureComplementaryStructure : ''],
      shearWallLength: [cw ? cw.shearWallLength : ''],
      calculationNote: [cw ? cw.calculationNote : ''],
      numberOfRows: [cw ? cw.numberOfRows : ''],
      arrayIntegration: [cw ? cw.arrayIntegration : ''],
      arrayIntegrationInfos: [cw ? cw.arrayIntegrationInfos : ''],
      natureInkingSupport: [cw ? cw.natureInkingSupport : ''],
      infosNatureInkingSupport: [cw ? cw.infosNatureInkingSupport : ''],
      interiorCovering: [cw ? cw.interiorCovering : ''],
      infosInteriorCovering: [cw ? cw.infosInteriorCovering : ''],
      exteriorCovering: [cw ? cw.exteriorCovering : ''],
      infosExteriorCovering: [cw ? cw.infosExteriorCovering : '']
    });

    let c = this.editedBuilding != null ? this.editedBuilding.contacts : null;

    this.contactsFormGroup = this.formBuilder.group({
      projectOwner: [c ? c.projectOwner : ''],
      projectManager: [c ? c.projectManager : ''],
      architect: [c ? c.architect : ''],
      structureDesignOffice: [c ? c.structureDesignOffice : ''],
      controlOffice: [c ? c.controlOffice : ''],
      strawBaleCompany: [c ? c.strawBaleCompany : ''],
      carpentryInstallationCompany: [c ? c.carpentryInstallationCompany : ''],
      coatingImplementationCompany: [c ? c.coatingImplementationCompany : ''],
      projectDescriptionBox: [c ? c.projectDescriptionBox : ''],
      difficultiesBox: [c ? c.difficultiesBox : ''],
      tipsAndTricksBox: [c ? c.tipsAndTricksBox : ''],
      otherCommentBox: [c ? c.otherCommentBox : ''],
    });

    let p = this.editedBuilding != null ? this.editedBuilding.private : null;

    this.privateFormGroup = this.formBuilder.group({
      contact: [p ? p.contact : '', Validators.required],
      postalCode: [p ? p.postalCode : ''],
      email: [p ? p.email : userMail],
      phoneNumber: [p ? p.phoneNumber : ''],
    })

    this.tempPictures = this.editedBuilding != null ? this.editedBuilding.pictures : this.tempPictures;

    this.picturesFormGroup = this.formBuilder.group({});

    this.constructionWorksFormGroup.get('startDate')?.valueChanges.subscribe(startDate => {
      this.constructionWorksFormGroup!.get('endDate')?.updateValueAndValidity();
    });
  }


  SavedPicture($event: SavedPictureEventType) {
    console.log("save pictures");

    this.tempPictures[$event.index] =
    {
      alt: "picture presentation" + $event.index,
      index: $event.index.toString()
    }

  }


  // onSubmit() {
  //   this.generalInformationsFormGroup.valid
  //   console.log('Valeurs du formulaire :', this.generalInformationsFormGroup.value);
  // }

  checkFormStepOne() {
    this.generalInformationsFormGroup!.updateValueAndValidity();
    if (this.generalInformationsFormGroup?.invalid) {
      this.dialog.open(PopUpUserConfirmComponent, {
        width: '400px',
        backdropClass: 'backdrop-blur',
        panelClass: ['overlay-pop-up', 'error-popup'],
        data: {
          message: `Veuillez remplir tous les champs requis.`,
          modePopup: ModeConfirmPopup.Ok
        }
      });
      return;
    }
  }

  checkFormStepTwo() {
    this.constructionWorksFormGroup!.updateValueAndValidity();
    if (this.constructionWorksFormGroup?.invalid) {
      this.dialog.open(PopUpUserConfirmComponent, {
        width: '400px',
        backdropClass: 'backdrop-blur',
        panelClass: ['overlay-pop-up', 'error-popup'],
        data: {
          message: `Veuillez remplir tous les champs requis.`,
          modePopup: ModeConfirmPopup.Ok
        }
      });
      return;
    }
  }

  // validation pitctures :
  // checkFormStepThree() {
  //   this.constructionWorksFormGroup.updateValueAndValidity();
  // }

  checkFormStepFour() {
    this.contactsFormGroup!.updateValueAndValidity();

    // check validity
    if (this.contactsFormGroup?.invalid) {
      this.dialog.open(PopUpUserConfirmComponent, {
        width: '400px',
        backdropClass: 'backdrop-blur',
        panelClass: ['overlay-pop-up', 'error-popup'],
        data: {
          message: `Veuillez remplir tous les champs requis.`,
          modePopup: ModeConfirmPopup.Ok
        }
      });
      return;
    }

    // Server edit mode
    if (this.editedBuildingId != null) {


      let building: BuildingModel = {

        filesId: this.fileId!,
        firebaseId: this.editedBuildingId,
        ownerUserId: this.userId!,
        privateId: this.editedBuilding?.privateId!,
        adminNoteId: this.editedBuilding?.adminNoteId!,
        creationDate: this.editedBuilding?.creationDate!,
        lastModifiedDate: new Date().toDateString(),
        lastModifiedUserId: this.userId!,
        status: BuildingStatus.Waiting,
        generalInformations: this.generalInformationsFormGroup!.getRawValue(),
        constructionWorks: this.constructionWorksFormGroup!.getRawValue(),
        pictures: this.tempPictures!,
        private: this.privateFormGroup!.getRawValue(),
        contacts: this.contactsFormGroup!.getRawValue(),
      }

      this.buildingService.UpdateBuildingFromPreview(building, this.editedBuildingId, this.userId!);
      this.router.navigateByUrl("/preview/" + this.editedBuildingId);
      return;
    }

    // add to preview
    this.dialog.open(PopUpUserConfirmComponent, {
      width: '400px',
      backdropClass: 'backdrop-blur',
      panelClass: 'overlay-pop-up',
      data: {
        message: `L'association Nebraska s'engage à respecter la confidentialité de vos données. 
        L'utilisation de vos informations personnelles est strictement limitée à un usage interne.<br>
        <br>En cliquant sur le bouton "J'accepte", vous confirmez avoir pris connaissance de ce message
        et acceptez que le modérateur de Nebraska puisse, si nécessaire, modifier la fiche que vous
        venez de remplir.`,
        modePopup: ModeConfirmPopup.AgreeOrBack
      }
    }).afterClosed().subscribe(result => {
      if (result === true) {

        let building: BuildingModel = {

          filesId: this.fileId!,
          firebaseId: "",
          privateId: "",
          adminNoteId: "",
          ownerUserId: this.userId!,
          creationDate: new Date().toDateString(),
          lastModifiedDate: new Date().toDateString(),
          lastModifiedUserId: this.userId!,
          status: BuildingStatus.Draft,
          generalInformations: this.generalInformationsFormGroup!.getRawValue(),
          constructionWorks: this.constructionWorksFormGroup!.getRawValue(),
          pictures: this.tempPictures!,
          contacts: this.contactsFormGroup!.getRawValue(),
          private: this.privateFormGroup!.getRawValue()
        }

        this.buildingService.SetPreviewBuilding(building);
        console.log(building);
      }
    })

  }

  resetPosition() {
    if (this.editedBuildingId) {
      this.router.navigateByUrl("/select-map/" + this.editedBuildingId);
      return;
    }
    this.router.navigateByUrl("/select-map")
  }
}