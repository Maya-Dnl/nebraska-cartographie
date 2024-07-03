import { Component } from '@angular/core';
import oldBuildingsData from '../../../assets/initialData/oldBuildingsData.json';
import { ConstructionData } from './models/oldBuildingData.model';
import { BuildingModel } from '../../services/building/building.model';
import { BuildingService } from '../../services/building/building.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
@Component({
  selector: 'app-technical-admin',
  templateUrl: './technical-admin.component.html',
  styleUrl: './technical-admin.component.scss'
})
export class TechnicalAdminComponent {

  oldData = oldBuildingsData as ConstructionData[];

  waitingBuildingsId: string[] = [];

  constructor(protected buildingService: BuildingService) { }

  UndefinedToEmpty(value: any)
  {
    return value != undefined ? value : ""
  }

  map(oldValue: string | undefined): any {
    if (oldValue === undefined) {
      return "";
    }

    switch (oldValue) {

      // bottesCereale
      case "BLE":
        return "Blé";
      case "SEIGLE":
        return "Seigle";
      case "TRITICALE":
        return "Triticale";
      case "ORGE":
        return "Orge";
      case "RIZ":
        return "Riz";

      // RevetementExterieur
      case "BARDAGE_VENTILE":
        return "Bardage ventilé";
      case "ENDUIT_TERRE_ET_CHAUX":
        return "Enduit terre et chaux";
      case "ENDUIT_CHAUX":
        return "Enduit chaux";
      case "ENDUIT_TERRE":
        return "Enduit terre";
      case "ENDUIT_PLATRE":
        return "Enduit plâtre";
      case "BETON_ARME":
        return "Béton armé";
      case "MACONNERIE":
        return "Maconnerie (brique, parpaing, pierre..)";

      // revetInt
      case "LAMBRIS":
        return "Lambris";

      // participatif / autoconstruction
      case "OUI":
        return "Oui";
      case "NON":
        return "Non";
      case "PARTIEL":
        return "Partiel";

      // usageBatiment
      case "LOGEMENT_INDIVIDUEL":
        return "Logement individuel";
      case "BATIMENT_AGRICOLE":
        return "Bâtiment agricole";
      case "BATIMENT_ADMINISTRATIF":
        return "Bâtiment administratif";
      case "BATIMENT_DE_LOISIRS":
        return "Bâtiment de loisirs";
      case "BATIMENT_EDUCATIF":
        return "Bâtiment éducatif";
      case "LOGEMENT_INDIVIDUEL_GROUPE":
        return "Logement individuel groupé";
      case "AUTRE":
        return "Autre";
      case "OUVRAGE_EXCEPTIONNEL":
        return "Ouvrage exeptionnel";
      case "BATIMENT_COMMERCIAL":
        return "Bâtiment commercial";
      case "BATIMENT_INDUSTRIEL":
        return "Bâtiment industriel";

      // bottesTaille
      case "T_36_X_46_X_70_a_120_CM":
        return "Petites bottes";
      case "T_50_X_80_X_110_a_200_CM":
        return "Bottes matelas";
      case "T_70_X_120_X_230_CM":
        return "Grosses bottes";

      default:
        throw new Error("la valeur " + oldValue + " n'est pas connue");
    }
  }


  async ImportOldDataWithCheckByGPSPoint() {

    // const waitingBuildings = await firstValueFrom(this.buildingService.getWaitingBuildings())
    // const publishedBuildings = await firstValueFrom(this.buildingService.getPublishedBuildings())

    this.oldData.forEach(async oldData => {

      let newBuilding: BuildingModel = {

        id: oldData.latitudeLongitude.latitude + "" + oldData.latitudeLongitude.longitude,
        constructionWorks: {
          arrayIntegration: "",
          arrayIntegrationInfos: "",
          calculationNote: oldData.noteCalcul ? "true" : "false",
          cerealsUsed: this.map(oldData.bottesCereale?.objectId),
          complementaryStructure: oldData.structCompl ? "true" : "false",
          endDate: oldData.constructionFin?.iso != undefined ? new Date(oldData.constructionFin?.iso).toISOString() : "",
          exteriorCovering: this.map(oldData.revetExt?.objectId),
          infosExteriorCovering: "",
          infosInteriorCovering: "",
          infosNatureComplementaryStructure: "",
          infosNatureInkingSupport: this.UndefinedToEmpty(oldData.supportAncrageInfos),
          interiorCovering: this.map(oldData.revetInt?.objectId),
          natureComplementaryStructure: "",
          natureInkingSupport: this.map(oldData.supportAncrage?.objectId),
          numberOfRows: "",
          participatoryConstruction: this.map(oldData.participatif?.objectId),
          selfConstruction: this.map(oldData.autoconstruction?.objectId),
          shearWallLength: "",
          startDate: oldData.constructionDebut?.iso != undefined ? new Date(oldData.constructionDebut?.iso).toISOString() : "",
          typeOfInstallation: "",
          strawBaleDensity: this.UndefinedToEmpty(oldData.bottesDensite?.toString()),
          strawBaleInfos: this.UndefinedToEmpty(oldData.bottesTailleInfos),
          strawBaleSize: this.map(oldData.bottesTaille?.objectId),
          supplyDistance: this.UndefinedToEmpty(oldData.bottesDistanceApprovisionnement?.toString())
        },
        contacts: {
          architect: this.UndefinedToEmpty(oldData.architecte),
          carpentryInstallationCompany: "",
          coatingImplementationCompany: this.UndefinedToEmpty(oldData.entrepriseEnduits),
          contact: "",
          controlOffice: "",
          difficultiesBox: "",
          email: "",
          otherCommentBox: "",
          phoneNumber: "",
          postalCode: this.UndefinedToEmpty(oldData.codePostal),
          projectDescriptionBox: "",
          projectManager: "",
          projectOwner: "",
          strawBaleCompany: this.UndefinedToEmpty(oldData.entrepriseBottes),
          structureDesignOffice: "",
          tipsAndTricksBox: ""
        },
        generalInformations: {
          address: "",
          buildingName: "",
          buildingSurface: this.UndefinedToEmpty(oldData.surfacePlancher?.toString()),
          cityOrTown: "",
          constructionUse: this.map(oldData.usageBatiment?.objectId),
          infosConstructionUse: "",
          latitude: oldData.latitudeLongitude.latitude?.toString(),
          longitude: oldData.latitudeLongitude.longitude?.toString(),
          numberOfLevels: this.UndefinedToEmpty(oldData.niveaux?.toString()),
          totalCostOfWork: this.UndefinedToEmpty(oldData.coutTravauxTTC?.toString())
        },
        pictures: []
      }

      console.log(newBuilding);


      // waitingBuildings.forEach(value => {
      //   if (value.generalInformations == undefined) {
      //     return;
      //   }

      //   if (newBuilding.id == value.generalInformations.latitude + "" + value.generalInformations.longitude) {
      //     throw new Error("Il existe deja un building a cet emplacement : " + newBuilding.id)
      //   }
      // })

      // publishedBuildings.forEach(value => {
      //   if (value.generalInformations == undefined) {
      //     return;
      //   }
      //   if (newBuilding.id == value.generalInformations.latitude + "" + value.generalInformations.longitude) {
      //     throw new Error("Il existe deja un building a cet emplacement : " + newBuilding.id)
      //   }
      // })

      let doc = await this.buildingService.SaveBuildingFromPreview(newBuilding)
      this.waitingBuildingsId.push(doc.id);
    });
  }

  async PublishAddedBuildings()
  {
    this.waitingBuildingsId.forEach(async (id) => {
      await this.buildingService.publishBuilding(id);
    })
  }

}
