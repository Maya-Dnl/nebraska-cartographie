import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-user-confirm',
  templateUrl: './popup-user-confirm.component.html',
})
export class PopUpUserConfirmComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string, modePopup: ModeConfirmPopup}) {}

  public message = this.data.message;
  public modePopup = this.data.modePopup;

}

export enum ModeConfirmPopup{
 Ok = 0,
 YesNo = 1,
 ResendMailConfirm = 2
}
