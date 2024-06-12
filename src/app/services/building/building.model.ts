export interface BuildingModel {

  id: string;
  generalInformations: BGeneralInformations;
  constructionWorks: BConstructionWorks;
  pictures: BPictures;
  contacts: BContacts;

}

export interface BGeneralInformations {
  buildingName: string | undefined;
  address: string | undefined;
  cityOrTown: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  constructionUse: string | undefined;
  infosConstructionUse: string | undefined;
  totalCostOfWork: number | undefined;
  buildingSurface: number | undefined;
  numberOfLevels: number | undefined;
}

export interface BConstructionWorks {
  startDate: string | undefined;
  endDate: string | undefined;
  strawBaleSize: string | undefined;
  strawBaleInfos: string | undefined;
  typeOfInstallation: string | undefined;
  strawBaleDensity: number | undefined;
  cerealsUsed: string | undefined;
  supplyDistance: number | undefined;
  selfConstruction: string | undefined;
  participatoryConstruction: string | undefined;
  complementaryStructure: boolean | undefined;
  natureComplementaryStructure: string | undefined;
  infosNatureComplementaryStructure: string | undefined;
  shearWallLength: number | undefined;
  calculationNote: boolean | undefined;
  numberOfRows: number | undefined;
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

}

export interface BContacts {
  contact: string | undefined;
  postalCode: string | undefined;
  email: string | undefined;
  phoneNumber: number | undefined;
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