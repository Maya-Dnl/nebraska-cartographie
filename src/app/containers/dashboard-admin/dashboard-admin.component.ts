import { Component, inject } from '@angular/core';
import { BuildingModel } from '../../services/building/building.model';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BuildingService } from '../../services/building/building.service';
import { UserRole } from '../../store/models/user.model';

export const MockBuilding: BuildingModel = {
  id: "",
  generalInformations: {
    buildingName: "Construcion Thourie",
    address: "",
    cityOrTown: "",
    buildingSurface: undefined,
    constructionUse: "",
    infosConstructionUse: "",
    latitude: undefined,
    longitude: undefined,
    numberOfLevels: undefined,
    totalCostOfWork: undefined
  },
  constructionWorks: {
    arrayIntegration: "",
    arrayIntegrationInfos: "",
    calculationNote: undefined,
    cerealsUsed: "",
    complementaryStructure: undefined,
    endDate: "",
    exteriorCovering: "",
    infosExteriorCovering: "",
    infosInteriorCovering: "",
    infosNatureComplementaryStructure: "",
    infosNatureInkingSupport: "",
    interiorCovering: "",
    natureComplementaryStructure: "",
    natureInkingSupport: "",
    numberOfRows: undefined,
    participatoryConstruction: "",
    selfConstruction: "",
    shearWallLength: "",
    startDate: "",
    strawBaleDensity: undefined,
    strawBaleInfos: "",
    strawBaleSize: "",
    supplyDistance: undefined,
  },
  pictures: {

  },
  contacts: {
    architect: "",
    carpentryInstallationCompany: "",
    coatingImplementationCompany: "",
    contact: "",
    controlOffice: "",
    difficultiesBox: "",
    email: "",
    otherCommentBox: "",
    phoneNumber: "",
    postalCode: "",
    projectDescriptionBox: "",
    projectManager: "",
    projectOwner: "",
    strawBaleCompany: "",
    structureDesignOffice: "",
    tipsAndTricksBox: ""
  }
}


@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent {

  firestore: Firestore = inject(Firestore)

  waitingBuildings$: Observable<BuildingModel[]> | undefined;

  waitingModidifcationsBuildingsList: BuildingModel[] = [
    {
      ...MockBuilding,
      id: "1",
      generalInformations: { ...MockBuilding.generalInformations, buildingName: "toto" }
    },
    {
      ...MockBuilding,
      id: "2",
      generalInformations: { ...MockBuilding.generalInformations, buildingName: "titi" }
    },
    {
      ...MockBuilding,
      id: "3",
      generalInformations: { ...MockBuilding.generalInformations, buildingName: "tata" }
    },
  ];

  publishedBuildingsList: BuildingModel[] = [
    {
      ...MockBuilding,
      id: "1",
      generalInformations: { ...MockBuilding.generalInformations, buildingName: "toto" }
    },
    {
      ...MockBuilding,
      id: "2",
      generalInformations: { ...MockBuilding.generalInformations, buildingName: "titi" }
    },
    {
      ...MockBuilding,
      id: "3",
      generalInformations: { ...MockBuilding.generalInformations, buildingName: "tata" }
    },
  ];

  constructor(
    private router: Router,
    private buildingService: BuildingService
  ) {}

  ngOnInit() {
    this.waitingBuildings$ = this.buildingService.getWaitingBuildings();
    // UserRole.nebraskaAdministrator
  }

  viewOnMap(buildingId: string) {
    this.router.navigate(['/preview', buildingId]);
    // if(UserRole.nebraskaAdministrator) {
    //   this.displayBtnAdmin()
    // }
  }

  // displayBtnAdmin() {

  // }
}
