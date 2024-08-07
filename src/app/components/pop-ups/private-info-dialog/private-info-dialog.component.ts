// private-info-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrivateBuildingData } from '../../../services/building/building.model';


@Component({
  selector: 'app-private-info-dialog',
  templateUrl: './private-info-dialog.component.html',
//   styleUrls: ['./private-info-dialog.component.scss']
})
export class PrivateInfoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: PrivateBuildingData) {}
}