import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { selectTitle, selectUser } from '../../store/global.selectors';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthProcessService } from '../../services/authentication-service.service';
import { UserRole } from '../../store/models/user.model';
import { ModeConfirmPopup, PopUpUserConfirmComponent } from '../pop-ups/user-confirm-popup/popup-user-confirm.component';
import { activeGpsPointMode, changeTitle } from '../../store/global.actions';


@Component({
  selector: 'app-head-bar',
  templateUrl: './head-bar.component.html',
  styleUrl: './head-bar.component.scss'
})
export class HeadBarComponent {

  public userRole = UserRole;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    public dialog: MatDialog,
    public authProcess: AuthProcessService) { }

  title$ = this.store.select(selectTitle);
  user$ = this.store.select(selectUser);

  openPopUpUserLogout() {
    this.dialog.open(PopUpUserConfirmComponent, {
      width: '400px',
      backdropClass: 'backdrop-blur',
      panelClass: ['overlay-pop-up', 'error-popup'],
      data: { message: 'Etes-vous sûr de vouloir vous déconnecter ?', modePopup: ModeConfirmPopup.YesNo },
    }).afterClosed().subscribe(async result => {
      if (result === true) {
        await this.authProcess.signOut()
        this.router.navigateByUrl("/")
      }
    });
  };

  openPopupUserAddNewBuilding() {
    this.router.navigateByUrl("/select-map")
    this.dialog.open(PopUpUserConfirmComponent, {
      width: '400px',
      backdropClass: 'backdrop-blur',
      panelClass: 'overlay-pop-up',
      data: {
        message: `Vous vous apprêtez à remplir un document afin que Nebraska
        puisse référencer votre construction en paille porteuse sur sa carte.<br><br>Veuillez
        sélectionner, à l'aide de la croix, le lieu approximatif de votre construction,
        puis cliquez sur "Valider ma position".<br><br>(Veuillez zoomer au maximum sur la carte afin
        de faciliter le référencement.)`,
        modePopup: ModeConfirmPopup.OkOrBack
      }
    }).afterClosed().subscribe(result => {
      if (result === true) {
        
        this.store.dispatch(changeTitle({
          newTitle: "Veuillez sélectionner la position de votre construction"
        }))
        
        this.store.dispatch(activeGpsPointMode())
      }
      else {
        this.router.navigateByUrl("/home-map")
      }
    });
  }
}


