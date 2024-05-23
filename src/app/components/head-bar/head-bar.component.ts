import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { selectTitle } from '../../store/global.selectors';

@Component({
  selector: 'app-head-bar',
  templateUrl: './head-bar.component.html',
  styleUrl: './head-bar.component.scss'
})
export class HeadBarComponent {

  
  constructor(private store: Store<AppState>) {}

  
  title$ = this.store.select(selectTitle);

}
