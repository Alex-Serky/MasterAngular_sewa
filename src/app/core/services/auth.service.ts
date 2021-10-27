import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, tap, catchError, finalize } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UsersService } from './users.service';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: BehaviorSubject<User|null> = new BehaviorSubject<User|null>(null);
  public readonly user$: Observable<User|null> = this.user.asObservable();

  constructor(
    private http: HttpClient,
    private usersService: UsersService,
    private errorService: ErrorService,
    private loaderService: LoaderService,
    private router: Router) { }

  // Inscription
  public register(name: string, email: string, password: string): Observable<User|null> {
    const url =
    `${environment.firebase.auth.baseURL}/signupNewUser?key=
      ${environment.firebase.apiKey}`;

    const data = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type':  'application/json'})
    };

    this.loaderService.setLoading(true);

    return this.http.post(url, data, httpOptions).pipe(
      // On renvoit des données dans la variable data
      switchMap((data: any) => {
        // On extrait de cette première réponse un jeton JWT, et les informations de l'utilisateur
        const jwt: string = data.idToken;
        const user = new User({
        email: data.email,
        id: data.localId,
        name: name
        });
        // On sauvegarde les informations de connexion de l'utilisateur.
        return this.usersService.save(user, jwt);
      }),
      // Pousser l'utilisateur qui vient de s'inscrire dans l'état du service.
      tap(user => this.user.next(user)),
      // Transmettre l'erreur rencontrée directement à la méthode handleError du service, qui elle s'occupera de prévenir les utilisateurs
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  // Connexion
  public login(email: string, password: string): Observable<User|null> {
    const url = `${environment.firebase.auth.baseURL}/verifyPassword?key=
                  ${environment.firebase.apiKey}`;
    const data = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type':  'application/json'})
    };

    this.loaderService.setLoading(true); // Déclencher le loader

    return this.http.post<User>(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        const userId: string = data.localId;
        const jwt: string = data.idToken;
        return this.usersService.get(userId, jwt);
      }),
      tap(user => this.user.next(user)), // Mettre à jour l'état du service
      catchError(error => this.errorService.handleError(error)), // Intercepterles erreurs éventuelles
      finalize(() => this.loaderService.setLoading(false)) // Interompre le loader
    );
  }

  // Déconnection
  public logout(): void {
    this.user.next(null);
    this.router.navigate(['/login']);
  }

}