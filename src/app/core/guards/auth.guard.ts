import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

constructor(
  private authService: AuthService,
  private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => !!user), // !!user vaudra soit vrai, soit faux !
      tap(isLogged => {
        if(!isLogged) { // Si l'utilisateur n'est pas authentifié, alors on lui refuse l'accès à l'espace membre
          this.router.navigate(['/login']);
          return false;
        }

        return true;  // L'accès à la page sécurisée est possible.
      })
    );
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }
}