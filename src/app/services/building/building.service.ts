import { Router } from "@angular/router";
import { BuildingModel } from "./building.model";
import { inject, Injectable } from "@angular/core";
import { addDoc, deleteDoc, collection, collectionData, CollectionReference, doc, Firestore, getDoc, QueryDocumentSnapshot, SnapshotOptions, DocumentData, DocumentReference } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { updateDoc } from "firebase/firestore";

  export const publishedBuildingsCollectionName = "publishedBuildings"
  export const waitingBuildingsCollectionName = "waitingBuildings"

@Injectable({
  providedIn: "root",
})
export class BuildingService {

  private buildingPreview: BuildingModel | null = null;

  firestore: Firestore = inject(Firestore);

  constructor(private router: Router) { }

  public SetPreviewBuilding(building: BuildingModel) {
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

  public async SaveBuildingFromPreview(building: BuildingModel): Promise<DocumentReference<BuildingModel, DocumentData>> {
    let waitingBuildings: CollectionReference<BuildingModel> = collection(this.firestore, waitingBuildingsCollectionName).withConverter(buildingConverter);
    const addedBuildingDocumentReference = await addDoc(waitingBuildings, building );

    // Update the building with the generated ID
    building.firebaseId = addedBuildingDocumentReference.id;
    
    // Update the document with the new firebaseId field
    await updateDoc(addedBuildingDocumentReference, { firebaseId: building.firebaseId });

    return addedBuildingDocumentReference;
  }

  public async UpdateBuildingFromPreview(building: BuildingModel, editedBuildingId: string) {
    const documentReference = doc(this.firestore, waitingBuildingsCollectionName, editedBuildingId);
    return await updateDoc(documentReference, { ...building });
  }

  public getWaitingBuildings(): Observable<BuildingModel[]> {
    const waitingBuildingsCollection = collection(this.firestore, waitingBuildingsCollectionName).withConverter(buildingConverter);
    return collectionData(waitingBuildingsCollection, { idField: 'firebaseId' }) as Observable<BuildingModel[]>;
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
    console.log(building);
    let publishedBuildings: CollectionReference<BuildingModel> = collection(this.firestore, publishedBuildingsCollectionName).withConverter(buildingConverter);
    await addDoc(publishedBuildings, building);
    const documentReference = doc(this.firestore, waitingBuildingsCollectionName, id);
    await deleteDoc(documentReference);
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