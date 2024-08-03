export interface BuildingModel {

  firebaseId: string;
  filesId: string;
  privatePartId:string;
  ownerUserId: string;
  
  generalInformations: BGeneralInformations;
  constructionWorks: BConstructionWorks;
  pictures: BPictures[];
  contacts: BContacts;

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
  contact: string | undefined;
  postalCode: string | undefined;
  email: string | undefined;
  phoneNumber: string | undefined;
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