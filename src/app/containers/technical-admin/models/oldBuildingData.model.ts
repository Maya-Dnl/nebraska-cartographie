export interface Pointer {
    __type: "Pointer";
    className: string;
    objectId: string;
  }
  
  export interface DateType {
    __type: "Date";
    iso: string;
  }
  
  export interface GeoPoint {
    __type: "GeoPoint";
    latitude: number;
    longitude: number;
  }
  
  export interface ConstructionData {
    owner: Pointer;
    constructionDebut?: DateType;
    constructionFin?: DateType;
    surfacePlancher: number;
    coutTravauxTTC?: number;
    bottesTaille?: Pointer;
    usageBatiment: Pointer;
    noteCalcul?: boolean;
    travauxNeuf: boolean;
    travauxExtension: boolean;
    travauxRenov: boolean;
    travauxIte: boolean;
    travauxIti: boolean;
    niveaux: number;
    bottesDistanceApprovisionnement?: number;
    bottesCereale?: Pointer;
    revetInt?: Pointer;
    revetExt?: Pointer;
    codePostal: string;
    supportAncrage?: Pointer;
    latitudeLongitude: GeoPoint;
    autoconstruction?: Pointer;
    architecte?: string;
    entrepriseBottes?: string;
    participatif?: Pointer;
    structCompl?: boolean;
    bottesDensite?: number;
    entrepriseEnduits?: string;
    bottesTailleInfos?: string;
    supportAncrageInfos?: string;
  }
  
  // Exemple d'utilisation
//   const constructionData: ConstructionData[] = [
//     {
//       owner: { __type: "Pointer", className: "_User", objectId: "XXXXXXXXXXX" },
//       constructionDebut: { __type: "Date", iso: "2017-09-25" },
//       constructionFin: { __type: "Date", iso: "2019-08-31" },
//       surfacePlancher: 100,
//       coutTravauxTTC: 140000,
//       bottesTaille: { __type: "Pointer", className: "TaillesBottes", objectId: "T_36_X_46_X_70_a_120_CM" },
//       usageBatiment: { __type: "Pointer", className: "UsageBatiment", objectId: "LOGEMENT_INDIVIDUEL" },
//       noteCalcul: false,
//       travauxNeuf: false,
//       travauxExtension: true,
//       travauxRenov: false,
//       travauxIte: false,
//       travauxIti: false,
//       niveaux: 2,
//       bottesDistanceApprovisionnement: 15,
//       bottesCereale: { __type: "Pointer", className: "Cereale", objectId: "BLE" },
//       revetInt: { __type: "Pointer", className: "RevetementInterieur", objectId: "ENDUIT_TERRE" },
//       revetExt: { __type: "Pointer", className: "RevetementExterieur", objectId: "BARDAGE_VENTILE" },
//       codePostal: "59680",
//       supportAncrage: { __type: "Pointer", className: "SupportAncrage", objectId: "BETON_ARME" },
//       latitudeLongitude: { __type: "GeoPoint", latitude: 50.25985, longitude: 4.0847683 }
//     },
//  ];
  