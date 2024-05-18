export interface BuildingModel {

  id: string;
  generalInformations: BGeneralInformations;
  constructionWorks: BConstructionWorks;
  pictures: BPictures;
  contacts: BContacts;

}

export interface BGeneralInformations {
  buildingName: string | null;
  address: string | null;
  cityOrTown: string | null;
  latitude: number | null;
  longitude: number | null;
  constructionUse: string | null;
  infosConstructionUse: string | null;
  totalCostOfWork: string | null;
  buildingSurface: string | null;
  numberOfLevels: string | null;
}

export interface BConstructionWorks {
  startDate: string | null;
  endDate: string | null;
  strawBaleSize: string | null;
  strawBaleInfos: string | null;
  strawBaleDensity: string | null;
  cerealsUsed: string | null;
  supplyDistance: string | null;
  selfConstruction: string | null;
  participatoryConstruction: string | null;
  complementaryStructure: string | null;
  natureComplementaryStructure: string | null;
  infosNatureComplementaryStructure: string | null;
  shearWallLength: string | null;
  calculationNote: string | null;
  numberOfRows: string | null;
  arrayIntegration: string | null;
  arrayIntegrationInfos: string | null;
  natureInkingSupport: string | null;
  infosNatureInkingSupport: string | null;
  interiorCovering: string | null;
  infosInteriorCovering: string | null;
  exteriorCovering: string | null;
  infosExteriorCovering: string | null;
}

export interface BPictures {

}

export interface BContacts {
  contact: string | null;
  postalCode: string | null;
  email: string | null;
  phoneNumber: string | null;
  projectOwner: string | null;
  projectManager: string | null;
  architect: string | null;
  structureDesignOffice: string | null;
  controlOffice: string | null;
  strawBaleCompany: string | null;
  carpentryInstallationCompany: string | null;
  coatingImplementationCompany: string | null;
  projectDescriptionBox: string | null;
  difficultiesBox: string | null;
  tipsAndTricksBox: string | null;
  otherCommentBox: string | null;
}