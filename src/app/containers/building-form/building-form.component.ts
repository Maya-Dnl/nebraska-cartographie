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
  selfConstruction = new FormControl('');
  participatoryConstruction = new FormControl('');
  complementaryStructure = new FormControl('');
  options: string[] = ['Non', 'Partiel', 'Total'];
  optionsTwo: string[] = ['Non', 'Oui'];

  
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
  
  constructionWorksFormGroup = this.formBuilder.group({
    secondCtrl: ['', Validators.required],
    selectWorksCtrl: ['', Validators.required],
    startDateCtrl: ['', Validators.required],
    endDateCtrl: ['', Validators.required],
    strawBaleSizeCtrl: [''],
    strawBaleInfosCtrl: [''],
    strawBaleDensityCtrl: [''],
    cerealsUsedCtrl: ['', Validators.required],
    supplyDistanceCtrl: [''],
    selfConstruction: ['', Validators.required],
    participatoryConstruction: ['', Validators.required],
    complementaryStructure: ['', Validators.required],
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
  
  // picturesFormGroup = this.formBuilder.group({
    //   thirdCtrl: ['', Validators.required],
    // });
    
    // contactsFormGroup = this.formBuilder.group({
      //   fourthCtrl: ['', Validators.required],
      // });
      
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