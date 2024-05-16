import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
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

  constructionUseOptions: string[] = ['Logement collectif', 'Logement individuel', 'Logement individuel groupé', 'Bâtiment administratif', 'Bâtiment commercial', 'Bâtiment industriel', 'Bâtiment de loisir', 'Bâtiment de santé', 'Bâtiment de retraite', 'Bâtiment éducatif', 'Bâtiment socio-culturel', 'Bâtiment agricole', 'Ouvrage exeptionnel', 'autre']

  generalInformationsFormGroup = this.formBuilder.group({
    buildingName: ['Maison Libération', Validators.required],
    address: ['3 rue des Iris'],
    cityOrTown: ['38000, Grenoble', Validators.required],
    latitude: [''],
    longitude: [''],
    constructionUse: ['Logement individuel', Validators.required],
    infosConstructionUse: ["Maison d'architecte construite en plein coeur de grenoble"],
    totalCostOfWork: ['180 000 €', Validators.required],
    buildingSurface: ['82 m²', Validators.required],
    numberOfLevels: ['2', Validators.required],
  });

  selfConstructionOptions: string[] = ['Oui', 'Non', 'Partiel'];
  participatoryConstructionOptions: string[] = ['Oui', 'Non', 'Partiel<'];
  complementaryStructureOptions: string[] = ['Bois', 'Béton armé', 'Métal', 'Maconnerie (brique, parpaing, pierre..)', 'Autre']
  strawBaleSizeOptions: string[] = ['36 x 46 x 70 à 120', '70 x 120 x 230', '50 x 80 x 110 à 200', 'Autre']
  cerealsUsedOptions: string[] = ['Blé', 'Orge', 'Avoine', 'Seigle', 'Triticale', 'Riz', 'Autre']
  calculationNoteOptions: string[] = ['Oui', 'Non']
  arrayIntegrationOptions: string[] = ['Pré-cadre flottant', 'Elément coulissant', 'Elément fixe (poteau, montant, ..)', 'Autre']
  natureInkingSupportOptions: string[] = ['Bois', 'Béton armé', 'Métal', 'Maconnerie (brique, parpaing, pierre..)', 'Autre']
  interiorCoveringOptions: string[] = ['Plaque de plâtre', 'Lambris', 'Enduit terre', 'Enduit chaux', 'Enduit terre et chaux', 'Enduit plâtre', 'Autre']
  exteriorCoveringOptions: string[] = ['Bardage ventilé', 'Enduit terre', 'Enduit chaux', 'Enduit terre et chaux', 'Enduit plâtre', 'Panneau', 'Autre']


  constructionWorksFormGroup = this.formBuilder.group({
    startDate: ["2024-05-10T22:00:00.000Z", Validators.required],
    endDate: ["2024-05-16T22:00:00.000Z", Validators.required],
    strawBaleSize: ['36 x 46 x 70 à 120'],
    strawBaleInfos: ['Bottes de pailles rectangulaires de chez PailleCompany'],
    strawBaleDensity: ['35 kg/m3'],
    cerealsUsed: ['Orge', Validators.required],
    supplyDistance: ['75 km'],
    selfConstruction: ['Partiel', Validators.required],
    participatoryConstruction: ['Oui', Validators.required],
    complementaryStructure: ['Bois', Validators.required],
    natureComplementaryStructure: ['Sapin'],
    infosNatureComplementaryStructure: ['Mélange de bois de Sapin et de métal, fondations en béton armé'],
    shearWallLength: ['10 m'],
    calculationNote: ['Oui'],
    numberOfRows: ['7'],
    arrayIntegration: ['Pré-cadre flottant'],
    arrayIntegrationInfos: ["Blabla sur l'intégration des baies"],
    natureInkingSupport: ['Bois'],
    infosNatureInkingSupport: ["Blabla sur le support d'ancrage"],
    interiorCovering: ['Enduit terre'],
    infosInteriorCovering: ["Blabla sur le revêtement intérieur"],
    exteriorCovering: ['Enduit terre et chaux'],
    infosExteriorCovering: ["Blabla sur le revêtement extérieur"]
  });

  selectWorks = this.formBuilder.group({
    neuf: [false],
    extension: [false],
    renovation: [false],
    isolationExt: [false],
    isolationInt: [false]
  });

  picturesFormGroup = this.formBuilder.group({
  });

  contactsFormGroup = this.formBuilder.group({
    contact: ['Mathilde Lapierre', Validators.required],
    postalCode: ['38000, Grenoble', Validators.required],
    email: ['mathilde.lapierre@gmail.com', Validators.required],
    phoneNumber: ['0606060606', Validators.required],
    projectOwner: ['Hamelin / Lapierre'],
    projectManager: ['Hamelin / Lapierre'],
    architect: ['Hamelin / Lapierre'],
    structureDesignOffice: ['Nebraska'],
    controlOffice: ['toto'],
    strawBaleCompany: ['toto'],
    carpentryInstallationCompany: ['toto'],
    coatingImplementationCompany: ['toto'],
    projectDescriptionBox: ['toto'],
    difficultiesBox: ['toto'],
    tipsAndTricksBox: ['toto'],
    otherCommentBox: ['toto'],
  });

  constructor(
    private buildingService: BuildingService,
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

  checkFormStepTwo() {
    this.constructionWorksFormGroup.updateValueAndValidity();
  }

  // validation pitctures :
  // checkFormStepThree() {
  //   this.constructionWorksFormGroup.updateValueAndValidity();
  // }

  checkFormStepFour() {
    this.contactsFormGroup.updateValueAndValidity();

    let building: BuildingModel = {

      id: this.tempId,
      generalInformations: this.generalInformationsFormGroup.getRawValue(),
      constructionWorks: this.constructionWorksFormGroup.getRawValue(),
      pictures: {},
      contacts: this.contactsFormGroup.getRawValue(),
    }
    
    this.buildingService.SetPreviewBuilding(building);
    console.log(building);
  }
}