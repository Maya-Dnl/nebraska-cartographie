import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { BuildingModel } from '../../services/building/building.model';
import { BuildingService } from '../../services/building/building.service';


@Component({
  selector: 'app-building-form',
  templateUrl: './building-form.component.html',
  styleUrl: './building-form.component.scss'
})


export class BuildingFormComponent {

  maxDate = new Date();
  tempId = Date.now().toString();

  // constructionUseOptions: string[] = ['Logement collectif', 'Logement individuel', 'Logement individuel groupé', 'Bâtiment administratif', 'Bâtiment commercial', 'Bâtiment industriel', 'Bâtiment de loisir', 'Bâtiment de santé', 'Bâtiment de retraite', 'Bâtiment éducatif', 'Bâtiment socio-culturel', 'Bâtiment agricole', 'Ouvrage exeptionnel', 'autre']

  generalInformationsFormGroup: FormGroup | undefined = undefined

  selfConstructionOptions: string[] = ['Oui', 'Non', 'Partiel'];
  participatoryConstructionOptions: string[] = ['Oui', 'Non', 'Partiel'];
  complementaryStructureOptions: string[] = ['Bois', 'Béton armé', 'Métal', 'Maconnerie (brique, parpaing, pierre..)', 'Autre']
  strawBaleSizeOptions: string[] = ['36 x 46 x 70 à 120', '70 x 120 x 230', '50 x 80 x 110 à 200', 'Autre']
  cerealsUsedOptions: string[] = ['Blé', 'Orge', 'Avoine', 'Seigle', 'Triticale', 'Riz', 'Autre']
  calculationNoteOptions: string[] = ['Oui', 'Non']
  arrayIntegrationOptions: string[] = ['Pré-cadre flottant', 'Elément coulissant', 'Elément fixe (poteau, montant, ..)', 'Autre']
  natureInkingSupportOptions: string[] = ['Bois', 'Béton armé', 'Métal', 'Maconnerie (brique, parpaing, pierre..)', 'Autre']
  interiorCoveringOptions: string[] = ['Plaque de plâtre', 'Lambris', 'Enduit terre', 'Enduit chaux', 'Enduit terre et chaux', 'Enduit plâtre', 'Autre']
  exteriorCoveringOptions: string[] = ['Bardage ventilé', 'Enduit terre', 'Enduit chaux', 'Enduit terre et chaux', 'Enduit plâtre', 'Panneau', 'Autre']


  constructionWorksFormGroup: FormGroup | undefined = undefined;

  selectWorks = this.formBuilder.group({
    neuf: [false],
    extension: [false],
    renovation: [false],
    isolationExt: [false],
    isolationInt: [false]
  });

  picturesFormGroup = this.formBuilder.group({
  });

  contactsFormGroup: FormGroup | undefined = undefined;

  constructor(
    private buildingService: BuildingService,
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {
    this._adapter.setLocale(this._locale);
  }

  ngOnInit() {

    let editedBuilding = this.buildingService.GetPreviewBuildingFromCache();


    let gi = editedBuilding != null ? editedBuilding.generalInformations : null;

    this.generalInformationsFormGroup = this.formBuilder.group({
      buildingName: [gi ? gi.buildingName : ''],
      address: [gi ? gi.address : ''],
      cityOrTown: [gi ? gi.cityOrTown : '', Validators.required],
      latitude: [gi ? gi.latitude : '', Validators.required],
      longitude: [gi ? gi.longitude : '', Validators.required],
      constructionUse: [gi ? gi.constructionUse : '', Validators.required],
      infosConstructionUse: [gi ? gi.infosConstructionUse : ''],
      totalCostOfWork: [gi ? gi.totalCostOfWork : '', Validators.required],
      buildingSurface: [gi ? gi.buildingSurface : '', Validators.required],
      numberOfLevels: [gi ? gi.numberOfLevels : '', Validators.required],
    });

    let cw = editedBuilding != null ? editedBuilding.constructionWorks : null;

    this.constructionWorksFormGroup = this.formBuilder.group({
      startDate: [cw ? cw.startDate : '', Validators.required],
      endDate: [cw ? cw.endDate : '', Validators.required],
      strawBaleSize: [cw ? cw.strawBaleSize : ''],
      strawBaleInfos: [cw ? cw.strawBaleInfos : ''],
      strawBaleDensity: [cw ? cw.strawBaleDensity : ''],
      cerealsUsed: [cw ? cw.cerealsUsed : '', Validators.required],
      supplyDistance: [cw ? cw.supplyDistance : ''],
      selfConstruction: [cw ? cw.selfConstruction : '', Validators.required],
      participatoryConstruction: [cw ? cw.participatoryConstruction : '', Validators.required],
      complementaryStructure: [cw ? cw.complementaryStructure : '', Validators.required],
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

    let c = editedBuilding != null ? editedBuilding.contacts : null;

    this.contactsFormGroup = this.formBuilder.group({
      contact: [c ? c.contact : '', Validators.required],
      postalCode: [c ? c.postalCode : '', Validators.required],
      email: [c ? c.email : '', Validators.required],
      phoneNumber: [c ? c.phoneNumber : '', Validators.required],
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
  
  }

  // onSubmit() {
  //   this.generalInformationsFormGroup.valid
  //   console.log('Valeurs du formulaire :', this.generalInformationsFormGroup.value);
  // }

  checkFormStepOne() {
    this.generalInformationsFormGroup!.updateValueAndValidity();
  }

  checkFormStepTwo() {
    this.constructionWorksFormGroup!.updateValueAndValidity();
  }

  // validation pitctures :
  // checkFormStepThree() {
  //   this.constructionWorksFormGroup.updateValueAndValidity();
  // }

  checkFormStepFour() {
    this.contactsFormGroup!.updateValueAndValidity();

    let building: BuildingModel = {

      id: this.tempId,
      generalInformations: this.generalInformationsFormGroup!.getRawValue(),
      constructionWorks: this.constructionWorksFormGroup!.getRawValue(),
      pictures: {},
      contacts: this.contactsFormGroup!.getRawValue(),
    }

    this.buildingService.SetPreviewBuilding(building);
    console.log(building);
  }
}