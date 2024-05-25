import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { selectTitle, selectUser } from '../../store/global.selectors';
import { MatDialog } from '@angular/material/dialog';
import { PopUpUserLogoutComponent } from '../pop-ups/user-logout/popup-user-logout.component';
import { Router } from '@angular/router';
import { AuthProcessService } from '../../services/authentication-service.service';


@Component({
  selector: 'app-head-bar',
  templateUrl: './head-bar.component.html',
  styleUrl: './head-bar.component.scss'
})
export class HeadBarComponent {

  
  constructor(private store: Store<AppState>, private router: Router, public dialog: MatDialog, public authProcess: AuthProcessService) {}

  title$ = this.store.select(selectTitle);
  user$ = this.store.select(selectUser);

  openPopUpUserLogout() {
    let popupOpened = this.dialog.open(PopUpUserLogoutComponent, {
      width: '400px',
      backdropClass: 'backdrop-blur',
      panelClass: 'overlay-pop-up'
    });
    
    popupOpened.afterClosed().subscribe(async result => {
      if(result === true) {
       await this.authProcess.signOut()
       this.router.navigateByUrl("/")
      }
    });
  };
}


