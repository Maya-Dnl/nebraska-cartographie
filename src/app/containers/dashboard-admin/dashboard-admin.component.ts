import { Component, inject } from '@angular/core';
import { BuildingModel } from '../../services/building/building.model';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collection } from 'firebase/firestore';

export const MockBuilding: BuildingModel = {
  id: "",
  generalInformations: {
    buildingName: "Construcion Thourie",
    address: "",
    cityOrTown: "",
    buildingSurface: "",
    constructionUse: "",
    infosConstructionUse: "",
    latitude: null,
    longitude: null,
    numberOfLevels: "",
    totalCostOfWork: ""
  },
  constructionWorks: {
    arrayIntegration: "",
    arrayIntegrationInfos: "",
    calculationNote: "",
    cerealsUsed: "",
    complementaryStructure: "",
    endDate: "",
    exteriorCovering: "",
    infosExteriorCovering: "",
    infosInteriorCovering: "",
    infosNatureComplementaryStructure: "",
    infosNatureInkingSupport: "",
    interiorCovering: "",
    natureComplementaryStructure: "",
    natureInkingSupport: "",
    numberOfRows: "",
    participatoryConstruction: "",
    selfConstruction: "",
    shearWallLength: "",
    startDate: "",
    strawBaleDensity: "",
    strawBaleInfos: "",
    strawBaleSize: "",
    supplyDistance: "",
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

  waitingBuildings$: Observable<any[]>;

  // waitingBuildingsList: BuildingModel[] = [
  //   {
  //     ...MockBuilding,
  //     id: "1",
  //     generalInformations: { ...MockBuilding.generalInformations, buildingName: "toto" }
  //   },
  //   {
  //     ...MockBuilding,
  //     id: "2",
  //     generalInformations: { ...MockBuilding.generalInformations, buildingName: "titi" }
  //   },
  //   {
  //     ...MockBuilding,
  //     id: "3",
  //     generalInformations: { ...MockBuilding.generalInformations, buildingName: "tata" }
  //   },
  // ];

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

  constructor() {
    const waitingBuildingsCollection = collection(this.firestore, 'waitingBuildings')
    this.waitingBuildings$ = collectionData(waitingBuildingsCollection);
  }
}
