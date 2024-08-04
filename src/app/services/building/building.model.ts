export interface BuildingModel {


  firebaseId: string;
  filesId: string;
  privateId: string;
  adminNoteId: string;
  ownerUserId: string;
  status: BuildingStatus; // Draft, Waiting, Publish
  creationDate: string;
  lastModifiedDate: string;
  lastModifiedUserId: string;

  generalInformations: BGeneralInformations;
  constructionWorks: BConstructionWorks;
  pictures: BPictures[];
  contacts: BContacts;
  private: PrivateBuildingData;

}

export interface BGeneralInformations {
  buildingName: string | undefined;
  address: string | undefined;
  cityOrTown: string | undefined;
  latitude: string | undefined;
  longitude: string | undefined;
  constructionUse: string | undefined;
  infosConstructionUse: string | undefined;
  totalCostOfWork: string | undefined;
  buildingSurface: string | undefined;
  numberOfLevels: string | undefined;
}

export interface BConstructionWorks {
  startDate: string | undefined;
  endDate: string | undefined;
  strawBaleSize: string | undefined;
  strawBaleInfos: string | undefined;
  typeOfInstallation: string | undefined;
  strawBaleDensity: string | undefined;
  cerealsUsed: string | undefined;
  supplyDistance: string | undefined;
  selfConstruction: string | undefined;
  participatoryConstruction: string | undefined;
  complementaryStructure: string | undefined;
  natureComplementaryStructure: string | undefined;
  infosNatureComplementaryStructure: string | undefined;
  shearWallLength: string | undefined;
  calculationNote: string | undefined;
  numberOfRows: string | undefined;
  arrayIntegration: string | undefined;
  arrayIntegrationInfos: string | undefined;
  natureInkingSupport: string | undefined;
  infosNatureInkingSupport: string | undefined;
  interiorCovering: string | undefined;
  infosInteriorCovering: string | undefined;
  exteriorCovering: string | undefined;
  infosExteriorCovering: string | undefined;
}

export interface BPictures {
  index: string
  alt: string
}

export interface BContacts {
  projectOwner: string | undefined;
  projectManager: string | undefined;
  architect: string | undefined;
  structureDesignOffice: string | undefined;
  controlOffice: string | undefined;
  strawBaleCompany: string | undefined;
  carpentryInstallationCompany: string | undefined;
  coatingImplementationCompany: string | undefined;
  projectDescriptionBox: string | undefined;
  difficultiesBox: string | undefined;
  tipsAndTricksBox: string | undefined;
  otherCommentBox: string | undefined;
}

export interface PrivateBuildingData
{
  contact: string | undefined;
  postalCode: string | undefined;
  email: string | undefined;
  phoneNumber: string | undefined;
}



export enum BuildingStatus {
  Draft = 0,
  Waiting = 1,
  Publish = 2
}