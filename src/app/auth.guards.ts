import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthProcessService } from './services/authentication-service.service';
import { AppState } from './store/app.state';
import { Store } from '@ngrx/store';
import { userLogInSuccess } from './store/global.actions';
import { selectUser } from './store/global.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.store.select(selectUser).pipe(
      take(1), // On prend seulement le premier résultat
      map(userModel => {
        if (userModel != null) {
          return true;
        } else {
          // Redirige l'utilisateur vers la page de connexion
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}