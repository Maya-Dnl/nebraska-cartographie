import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-building-form',
  templateUrl: './building-form.component.html',
  styleUrl: './building-form.component.scss'
})


export class BuildingFormComponent {

  maxDate = new Date();
  
  constructionUseOptions: string[] = ['Logement collectif', 'Logement individuel', 'Logement individuel groupé', 'Bâtiment administratif', 'Bâtiment commercial', 'Bâtiment industriel','Bâtiment de loisir', 'Bâtiment de santé', 'Bâtiment de retraite', 'Bâtiment éducatif', 'Bâtiment socio-culturel', 'Bâtiment agricole', 'Ouvrage exeptionnel', 'autre']
  
  generalInformationsFormGroup = this.formBuilder.group({
    buildingNameCtrl: ['', Validators.required],
    addressCtrl: [''],
    cityOrTownCtrl: ['', Validators.required],
    latitudeCtrl: [''],
    longitudeCtrl: [''],
    constructionUseCtrl: ['', Validators.required],
    infosConstructionUseCtrl: [''],
    totalCostOfWorkCtrl: ['', Validators.required],
    buildingSurfaceCtrl: ['', Validators.required],
    numberOfLevelsCtrl: ['', Validators.required],
  });

  selfConstructionOptions: string[] = ['Oui','Non', 'Partiel'];
  participatoryConstructionOptions: string[] = ['Oui','Non', 'Partiel'];
  complementaryStructureOptions: string[] = ['Bois', 'Béton armé', 'Métal', 'Maconnerie (brique, parpaing, pierre..)', 'Autre']
  strawBaleSizeOptions: string[] = ['36 x 46 x 70 à 120' , '70 x 120 x 230' , '50 x 80 x 110 à 200', 'Autre']
  cerealsUsedOptions: string[] = ['Blé', 'Orge', 'Avoine', 'Seigle', 'Triticale', 'Riz', 'Autre']
  calculationNoteCtrlOptions: string[] = ['Oui', 'Non']
  arrayIntegrationOptions: string[] = ['Pré-cadre flottant', 'Elément coulissant', 'Elément fixe (poteau, montant, ..)', 'Autre']
  natureInkingSupportOptions: string[] = ['Bois', 'Béton armé', 'Métal', 'Maconnerie (brique, parpaing, pierre..)', 'Autre']
  interiorCoveringOptions: string[] = ['Plaque de plâtre', 'Lambris', 'Enduit terre', 'Enduit chaux', 'Enduit terre et chaux', 'Enduit plâtre', 'Autre']
  exteriorCoveringOptions: string[] = ['Bardage ventilé', 'Enduit terre', 'Enduit chaux', 'Enduit terre et chaux', 'Enduit plâtre', 'Panneau', 'Autre']


  constructionWorksFormGroup = this.formBuilder.group({
    selectWorksCtrl: ['', Validators.required],
    startDateCtrl: ['', Validators.required],
    endDateCtrl: ['', Validators.required],
    strawBaleSizeCtrl: [''],
    strawBaleInfosCtrl: [''],
    strawBaleDensityCtrl: [''],
    cerealsUsedCtrl: ['', Validators.required],
    supplyDistanceCtrl: [''],
    selfConstructionCtrl: ['', Validators.required],
    participatoryConstructionCtrl: ['', Validators.required],
    complementaryStructureCtrl: ['', Validators.required],
    natureComplementaryStructureCtrl: [''],
    infosNatureComplementaryStructureCtrl: [''],
    shearWallLengthCtrl: [''],
    calculationNoteCtrl: [''],
    numberOfRowsCtrl: [''],
    arrayIntegrationCtrl: [''],
    arrayIntegrationInfosCtrl: [''],
    natureInkingSupportCtrl: [''],
    infosNatureInkingSupportCtrl: [''],
    interiorCoveringCtrl: [''],
    infosInteriorCoveringCtrl: [''],
    exteriorCoveringCtrl: [''],
    infosExteriorCoveringCtrl: ['']
  });

  selectWorks = this.formBuilder.group({
    neuf: [false],
    extension: [false],
    renovation: [false],
    isolationExt: [false],
    isolationInt: [false]
  });

  picturesFormGroup = this.formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });

  contactsFormGroup = this.formBuilder.group({
    contactCtrl: ['', Validators.required],
    postalCodeCtrl: ['', Validators.required],
    emailCtrl: ['', Validators.required],
    phoneNumberCtrl: ['', Validators.required],
    projectOwnerCtrl: [''],
    projectManagerCtrl: [''],
    architectCtrl: [''],
    structureDesignOfficeCtrl: [''],
    controlOfficeCtrl: [''],
    strawBaleCompanyCtrl: [''],
    carpentryInstallationCompanyCtrl: [''],
    coatingImplementationCompanyCtrl: [''],
    projectDescriptionBoxCtrl: [''],
    difficultiesBoxCtrl: [''],
    tipsAndTricksBoxCtrl: [''],
    otherCommentBoxCtrl: [''],
  });

  constructor(
    private formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {
    this._adapter.setLocale(this._locale);
  }
  // onSubmit() {
  //   this.generalInformationsFormGroup.valid
  //   console.log('Valeurs du formulaire :', this.generalInformationsFormGroup.value);
  // }

  checkFormStepOne() {
    this.generalInformationsFormGroup.updateValueAndValidity();
  }
}