import { Component } from '@angular/core';
import oldBuildingsData from '../../../assets/initialData/oldBuildingsData.json';
import { ConstructionData } from './models/oldBuildingData.model';
import { BuildingModel } from '../../services/building/building.model';
@Component({
  selector: 'app-technical-admin',
  templateUrl: './technical-admin.component.html',
  styleUrl: './technical-admin.component.scss'
})
export class TechnicalAdminComponent {

  oldData = oldBuildingsData as ConstructionData[]

  ImportOldDataWithCheckByGPSPoint() {
    this.oldData.forEach(oldData => {

      let newBuilding: BuildingModel = {

        id: oldData.latitudeLongitude.latitude + "" + oldData.latitudeLongitude.longitude,
        constructionWorks: {
          arrayIntegration: undefined,
          arrayIntegrationInfos: undefined,
          calculationNote: oldData.noteCalcul,
          cerealsUsed: oldData.bottesCereale?.__type,
          complementaryStructure: oldData.structCompl,
          endDate: oldData.constructionFin?.__type,
          exteriorCovering: oldData.revetExt?.__type,
          infosExteriorCovering: undefined,
          infosInteriorCovering: undefined,
          infosNatureComplementaryStructure: undefined,
          infosNatureInkingSupport: oldData.supportAncrageInfos,
          interiorCovering: oldData.revetInt?.__type,
          natureComplementaryStructure: undefined,
          natureInkingSupport: oldData.supportAncrage?.__type,
          numberOfRows: undefined,
          participatoryConstruction: oldData.participatif?.__type,
          selfConstruction: oldData.autoconstruction?.__type,
          shearWallLength: undefined,
          startDate: oldData.constructionDebut?.__type,
          typeOfInstallation: undefined,
          strawBaleDensity: oldData.bottesDensite,
          strawBaleInfos: oldData.bottesTailleInfos,
          strawBaleSize: oldData.bottesTaille?.__type,
          supplyDistance: oldData.bottesDistanceApprovisionnement
        },
        contacts: {
          architect: oldData.architecte,
          carpentryInstallationCompany: undefined,
          coatingImplementationCompany: oldData.entrepriseEnduits,
          contact: undefined,
          controlOffice: undefined,
          difficultiesBox: undefined,
          email: undefined,
          otherCommentBox: undefined,
          phoneNumber: undefined,
          postalCode: oldData.codePostal,
          projectDescriptionBox: undefined,
          projectManager: undefined,
          projectOwner: undefined,
          strawBaleCompany: oldData.entrepriseBottes,
          structureDesignOffice: undefined,
          tipsAndTricksBox: undefined
        },
        generalInformations:{
          address: undefined,
          buildingName: undefined,
          buildingSurface: oldData.surfacePlancher,
          cityOrTown: undefined,
          constructionUse: oldData.usageBatiment.__type,
          infosConstructionUse: undefined,
          latitude: oldData.latitudeLongitude.latitude,
          longitude: oldData.latitudeLongitude.longitude,
          numberOfLevels: oldData.niveaux,
          totalCostOfWork: oldData.coutTravauxTTC
        },
        pictures: {
        
        }
          
    
      }

      console.log(newBuilding);
    });
}
}
