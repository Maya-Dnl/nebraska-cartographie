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
          arrayIntegration: null,
          arrayIntegrationInfos: null,
          calculationNote: null,
          cerealsUsed: null,
          complementaryStructure: null,
          endDate: null,
          exteriorCovering: null,
          infosExteriorCovering: null,
          infosInteriorCovering: null,
          infosNatureComplementaryStructure: null,
          infosNatureInkingSupport: null,
          interiorCovering: null,
          natureComplementaryStructure: null,
          natureInkingSupport: null,
          numberOfRows: null,
          participatoryConstruction: null,
          selfConstruction: null,
          shearWallLength: null,
          startDate: null,
          strawBaleDensity: null,
          strawBaleInfos: null,
          strawBaleSize: null,
          supplyDistance: null
        },
        contacts: {
          architect: null,
          carpentryInstallationCompany: null,
          coatingImplementationCompany: null,
          contact: null,
          controlOffice: null,
          difficultiesBox: null,
          email: null,
          otherCommentBox: null,
          phoneNumber: null,
          postalCode: null,
          projectDescriptionBox: null,
          projectManager: null,
          projectOwner: null,
          strawBaleCompany: null,
          structureDesignOffice: null,
          tipsAndTricksBox: null
        },
        generalInformations:{
          address: null,
          buildingName: null,
          buildingSurface: null,
          cityOrTown: null,
          constructionUse: null,
          infosConstructionUse: null,
          latitude: null,
          longitude: null,
          numberOfLevels: null,
          totalCostOfWork: null
        },
        pictures: {
        
        }
          
    
      }

      console.log(newBuilding);
    });
}
}
