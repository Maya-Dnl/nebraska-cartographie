import { Router } from "@angular/router";
import { BuildingModel } from "./building.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class BuildingService {

  private buildingPreview: BuildingModel | null = null;

  constructor(private router: Router) { }

  public SetPreviewBuilding(building: BuildingModel) {
    this.buildingPreview = building;
    localStorage.setItem("BuildingPreview", JSON.stringify(building));
    this.router.navigateByUrl("/preview");
  }

  public GetPreviewBuilding(): BuildingModel {
    if (this.buildingPreview != null) {
      return this.buildingPreview
    }

    let jsonbuilding = localStorage.getItem("BuildingPreview");
    if (jsonbuilding != null) {
      this.buildingPreview = JSON.parse(jsonbuilding);
      return this.buildingPreview! 
    }

    throw Error("Aucune construction en preview n'a ete enregistree")
  }
}