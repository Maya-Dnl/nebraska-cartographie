import { Router } from "@angular/router";
import { AdminNoteData, BuildingModel, BuildingStatus, PrivateBuildingData } from "./building.model";
import { inject, Injectable } from "@angular/core";
import { addDoc, deleteDoc, collection, collectionData, CollectionReference, doc, Firestore, getDoc, QueryDocumentSnapshot, SnapshotOptions, DocumentData, DocumentReference } from "@angular/fire/firestore";
import { combineLatest, map, Observable } from "rxjs";
import { query, updateDoc, where } from "firebase/firestore";

export const publishedBuildingsCollectionName = "publishedBuildings"
export const waitingBuildingsCollectionName = "waitingBuildings"
export const privateDataBuildingsCollectionName = "privateDataBuildings"
export const adminNoteBuildingsCollectionName = "adminNoteBuildings"

@Injectable({
  providedIn: "root",
})
export class BuildingService {


  private buildingPreview: BuildingModel | null = null;

  firestore: Firestore = inject(Firestore);

  constructor(private router: Router) { }

  public SetPreviewBuilding(building: BuildingModel) {
    building.status = BuildingStatus.Draft;
    this.buildingPreview = building;
    localStorage.setItem("BuildingPreview", JSON.stringify(building));
    this.router.navigateByUrl("/preview");
  }

  public GetPreviewBuildingFromCache(): BuildingModel | undefined {
    if (this.buildingPreview != null) {
      return this.buildingPreview
    }

    let jsonbuilding = localStorage.getItem("BuildingPreview");
    if (jsonbuilding != null) {
      this.buildingPreview = JSON.parse(jsonbuilding);
      return this.buildingPreview!
    }
    return undefined;
  }

  public async GetPreviewBuildingFromServer(id: string): Promise<BuildingModel | undefined> {
    const documentReference = doc(this.firestore, waitingBuildingsCollectionName, id);
    const docSnapshot = await getDoc(documentReference);
    const building = docSnapshot.data() as BuildingModel | undefined;
    return building;
  }

  public RemovePrevewBuilding() {
    this.buildingPreview = null;
    localStorage.removeItem("BuildingPreview");
  }

  public async GetPrivateBuildingDataFromServer(filesId: string): Promise<PrivateBuildingData | undefined> {
    const documentReference = doc(this.firestore, privateDataBuildingsCollectionName, filesId);
    const docSnapshot = await getDoc(documentReference);
    const privateData = docSnapshot.data() as PrivateBuildingData | undefined;
    return privateData;
  }

  public async SaveBuildingFromPreview(building: BuildingModel, ownerUserId: string): Promise<DocumentReference<BuildingModel, DocumentData>> {
    building.status = BuildingStatus.Waiting;
    building.creationDate = new Date().toDateString();
    building.lastModifiedDate = new Date().toDateString();
    building.ownerUserId = ownerUserId;
    let waitingBuildings: CollectionReference<BuildingModel> = collection(this.firestore, waitingBuildingsCollectionName).withConverter(buildingConverter);
    const addedBuildingDocumentReference = await addDoc(waitingBuildings, building);

    // Update the building with the generated ID
    building.firebaseId = addedBuildingDocumentReference.id;

    // Update the document with the new firebaseId field
    await updateDoc(addedBuildingDocumentReference, { firebaseId: building.firebaseId });

    return addedBuildingDocumentReference;
  }

  public async SaveOrUpdateAdminNote(building: BuildingModel, adminNotText: string): Promise<void> {


    if (building.adminNoteId !== "") {
      let adminNoteOld = await this.getAdminNoteById(building.adminNoteId);

      adminNoteOld!.lastUpdate = Date.now().toString();
      adminNoteOld!.text = adminNotText;

      const documentReference = doc(this.firestore, adminNoteBuildingsCollectionName, building.adminNoteId).withConverter(adminNoteDataConverter);
      // Update the document with the new firebaseId field
      return await updateDoc(documentReference, { ...adminNoteOld });
    }

    // CREATE
    let adminNote: AdminNoteData = {
    creationDate:  Date.now().toString(),
    lastUpdate:  Date.now().toString(),
    text: adminNotText
    }

    let adminNotes: CollectionReference<AdminNoteData> = collection(this.firestore, adminNoteBuildingsCollectionName).withConverter(adminNoteDataConverter);
    const addedAdminNoteDocumentReference = await addDoc(adminNotes, adminNote);

    // Update the building with the generated ID
    building.adminNoteId = addedAdminNoteDocumentReference.id;
    return this.UpdateBuildingFromStatus(building);

  }

  public async getAdminNoteById(adminNoteId: string): Promise<AdminNoteData | undefined> {
    try {
      // Référence au document de la note admin
      const docRef = doc(this.firestore, adminNoteBuildingsCollectionName + "/" + adminNoteId).withConverter(adminNoteDataConverter);
      
      // Récupération du document
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Conversion et retour des données AdminNote
        return docSnap.data() as AdminNoteData;
      } else {
        console.error("Aucune note admin trouvée pour l'ID :", adminNoteId);
        return undefined;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la note admin :", error);
      throw error;
    }
  }

  public async UpdateBuildingFromStatus(building: BuildingModel) {
    if (building.status == BuildingStatus.Publish) {

      let publishedBuildings: CollectionReference<BuildingModel> = collection(this.firestore, publishedBuildingsCollectionName).withConverter(buildingConverter);
      await addDoc(publishedBuildings, building);
    } else if (building.status == BuildingStatus.Waiting) {

      let waitingBuildings: CollectionReference<BuildingModel> = collection(this.firestore, waitingBuildingsCollectionName).withConverter(buildingConverter);
      await addDoc(waitingBuildings, building);
    } else {
      return this.SetPreviewBuilding(building)
    }
  }


  public async UpdateBuildingFromPreview(building: BuildingModel, editedBuildingId: string, UserId: string) {
    building.status = BuildingStatus.Waiting;
    building.lastModifiedDate = new Date().toDateString();
    building.lastModifiedUserId = UserId;
    const documentReference = doc(this.firestore, waitingBuildingsCollectionName, editedBuildingId);
    return await updateDoc(documentReference, { ...building });
  }

  public getWaitingBuildings(): Observable<BuildingModel[]> {
    const waitingBuildingsCollection = collection(this.firestore, waitingBuildingsCollectionName).withConverter(buildingConverter);
    return collectionData(waitingBuildingsCollection, { idField: 'firebaseId' }) as Observable<BuildingModel[]>;
  }


  // New method to filter buildings by ownerUserId
  public getWaitingBuildingsByOwner(ownerUserId: string): Observable<BuildingModel[]> {
    const waitingBuildingsCollection = collection(this.firestore, waitingBuildingsCollectionName).withConverter(buildingConverter);

    // Create a query that filters buildings by ownerUserId
    const ownerQuery = query(waitingBuildingsCollection, where('ownerUserId', '==', ownerUserId));

    // Return the filtered collection as an observable
    return collectionData(ownerQuery, { idField: 'firebaseId' }) as Observable<BuildingModel[]>;
  }

  public getPublishBuildingsByOwner(ownerUserId: string): Observable<BuildingModel[]> {
    const publishBuildingsCollection = collection(this.firestore, publishedBuildingsCollectionName).withConverter(buildingConverter);

    // Create a query that filters buildings by ownerUserId
    const ownerQuery = query(publishBuildingsCollection, where('ownerUserId', '==', ownerUserId));

    // Return the filtered collection as an observable
    return collectionData(ownerQuery, { idField: 'firebaseId' }) as Observable<BuildingModel[]>;
  }

  // Method to combine both waiting and published buildings by ownerUserId
  public getAllBuildingsByOwner(ownerUserId: string): Observable<BuildingModel[]> {
    // Get both observables
    const waitingBuildings$ = this.getWaitingBuildingsByOwner(ownerUserId);
    const publishedBuildings$ = this.getPublishBuildingsByOwner(ownerUserId);

    // Combine both observables
    return combineLatest([waitingBuildings$, publishedBuildings$]).pipe(
      map(([waitingBuildings, publishedBuildings]) => {
        // Concatenate the results into a single array
        return [...waitingBuildings, ...publishedBuildings];
      })
    );
  }


  public getPublishedBuildings(): Observable<BuildingModel[]> {
    const waitingBuildingsCollection = collection(this.firestore, publishedBuildingsCollectionName).withConverter(buildingConverter);
    return collectionData(waitingBuildingsCollection, { idField: 'firebaseId' }) as Observable<BuildingModel[]>;
  }

  // function publish building(id)
  // recuperer un waiting building en fonction de l'id
  // mettre le building dans une liste published building
  // une fois valider, supprimer des waiting building

  public async publishBuilding(id: string) {

    console.log(id)
    const building = await this.GetPreviewBuildingFromServer(id);


    if (building === undefined) {
      throw new Error("Building is undefined for id : " + id)
    }

    const privateData = building?.privateData;
    building!.privateData = {
      contact: "",
      email: "",
      phoneNumber: "",
      postalCode: ""
    };

    console.log(building);
    building.status = BuildingStatus.Publish;

    if(building.privateId)
    {
      const documentReference = doc(this.firestore, privateDataBuildingsCollectionName, building.privateId);
      deleteDoc(documentReference);
    }

    // TODO HIDE SENSIBLE DATA
    let privateDataBuildings: CollectionReference<PrivateBuildingData> = collection(this.firestore, privateDataBuildingsCollectionName).withConverter(privateBuildingConverter);
    const privateDataBuildingDocumentReference = await addDoc(privateDataBuildings, privateData);

    // Update the building with the generated ID
    building.privateId = privateDataBuildingDocumentReference.id;

    // Update the document with the new firebaseId field
    await updateDoc(privateDataBuildingDocumentReference, { privateId: building.privateId });


    let publishedBuildings: CollectionReference<BuildingModel> = collection(this.firestore, publishedBuildingsCollectionName).withConverter(buildingConverter);
    await addDoc(publishedBuildings, building);

    const documentReference = doc(this.firestore, waitingBuildingsCollectionName, id);
    await deleteDoc(documentReference);
  }


  async getPrivateBuildingDataById(privateId: string): Promise<PrivateBuildingData | undefined> {
    try {
      const docRef = doc(this.firestore, privateDataBuildingsCollectionName + "/" + privateId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as PrivateBuildingData;
      } else {
        console.error("No private data found for ID:", privateId);
        return undefined;
      }
    } catch (error) {
      console.error("Error retrieving private data:", error);
      throw error;
    }
  }


  async unwaitingBuildings(WaitingBuilding: BuildingModel, userId: string) {
    const documentReference = doc(this.firestore, waitingBuildingsCollectionName, WaitingBuilding.firebaseId);
    await deleteDoc(documentReference).then(() => {
      this.SetPreviewBuilding(WaitingBuilding);
    })
  }

  async unpublishBuildings(publishedBuilding: BuildingModel, userId: string): Promise<void> {
    let privateData = await this.GetPrivateBuildingDataFromServer(publishedBuilding.privateId);
    if (privateData != undefined) {
      publishedBuilding.privateData = privateData!;
    }
    publishedBuilding.lastModifiedDate = new Date().toDateString();
    publishedBuilding.status = BuildingStatus.Draft;
    const documentReference = doc(this.firestore, publishedBuildingsCollectionName, publishedBuilding.firebaseId);
    await deleteDoc(documentReference).then(() => {
      this.SetPreviewBuilding(publishedBuilding);
    })
  }
}

export const buildingConverter = {
  toFirestore(building: BuildingModel) {
    return { ...building }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): BuildingModel {
    const data = snapshot.data(options);
    const building = { ...data as BuildingModel }
    return building
  }
}

export const privateBuildingConverter = {
  toFirestore(privateB: PrivateBuildingData) {
    return { ...privateB }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): PrivateBuildingData {
    const data = snapshot.data(options);
    const building = { ...data as PrivateBuildingData }
    return building
  }
}

export const adminNoteDataConverter = {
  toFirestore(adminNoteData: AdminNoteData) {
    return { ...adminNoteData }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): AdminNoteData {
    const data = snapshot.data(options);
    const typedData = { ...data as AdminNoteData }
    return typedData
  }
}