import { Router } from "@angular/router";
import { BuildingModel } from "./building.model";
import { inject, Injectable } from "@angular/core";
import { addDoc, collection, collectionData, CollectionReference, doc, DocumentReference, Firestore, getDoc, QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";
import { ReturnStatement } from "@angular/compiler";
import { Observable } from "rxjs";

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
    const documentReference = doc(this.firestore, 'waitingBuildings', id);
    const docSnapshot = await getDoc(documentReference);
    const building = docSnapshot.data() as BuildingModel | undefined;
    return building;
  }

  public RemovePrevewBuilding() {
    this.buildingPreview = null;
    localStorage.removeItem("BuildingPreview");
  }

  public async SaveBuildingFromPreview(building: BuildingModel): Promise<void> {
    let waitingBuildings: CollectionReference<BuildingModel> = collection(this.firestore, 'waitingBuildings').withConverter(buildingConverter);
    await addDoc(waitingBuildings, building);
  }
  public getWaitingBuildings(): Observable<BuildingModel[]> {
    const waitingBuildingsCollection = collection(this.firestore, 'waitingBuildings').withConverter(buildingConverter);
    return collectionData(waitingBuildingsCollection, { idField: 'id' }) as Observable<BuildingModel[]>;
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