import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap, tap, catchError, finalize, delay } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UsersService } from './users.service';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { Router } from '@angular/router';
import { ToastrService } from './toastr.service';


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
    private router: Router,
    private toastrService: ToastrService) { }

  /**
   * Inscription des utilisateurs
   * @param name
   * @param email
   * @param password
   * @returns
   */
  public register(name: string, email: string, password: string): Observable<User|null> {
    const url =
    `${environment.firebase.auth.baseURL}/signupNewUser?key=
      ${environment.firebase.apiKey}`;

    const data = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    this.loaderService.setLoading(true);

    return this.http.post(url, data, {}).pipe(
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
        this.saveAuthData(data.localId, jwt);
        return this.usersService.save(user);
      }),
      // Pousser l'utilisateur qui vient de s'inscrire dans l'état du service.
      tap(user => this.user.next(user)),
      tap(_ => this.logoutTimer(3600)),
      // Transmettre l'erreur rencontrée directement à la méthode handleError du service, qui elle s'occupera de prévenir les utilisateurs
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  /**
   * COnnexion des utilisateurs
   */
  public login(email: string, password: string): Observable<User|null> {
    const url = `${environment.firebase.auth.baseURL}/verifyPassword?key=
                  ${environment.firebase.apiKey}`;
    const data = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    this.loaderService.setLoading(true); // Déclencher le loader

    return this.http.post<User>(url, data, {}).pipe(
      switchMap((data: any) => {
        const userId: string = data.localId;
        const jwt: string = data.idToken;
        // On sauvegarde les informations de connexion de l'utilisateur.
        this.saveAuthData(data.localId, jwt);
        return this.usersService.get(userId);
      }),
      tap(user => this.user.next(user)), // Mettre à jour l'état du service
      tap(_ => this.logoutTimer(3600)),
      catchError(error => this.errorService.handleError(error)), // Intercepterles erreurs éventuelles
      finalize(() => this.loaderService.setLoading(false)) // Interompre le loader
    );
  }

  // Méthode permettant la modification de la durée de pomodoros et la MàJ de l'état
  public updateUserState(user: User): Observable<User|null> {
    this.loaderService.setLoading(true);

    return this.usersService.update(user).pipe(
      tap(user => this.user.next(user)),
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Vos informations ont été mises à jour !'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  get currentUser(): User|null {
    return this.user.getValue();
  }


  // Déconnexion
  public logout(): void {
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.user.next(null);
    this.router.navigate(['/login']);
  }

  // Et on ajoute la méthode qui déclenche cette fameuse minuterie :
  private logoutTimer(expirationTime: number): void {
    of(true).pipe(
      delay(expirationTime * 1000)
    ).subscribe(_ => this.logout());
  }

  private saveAuthData(userId: string, token: string) {
    const now = new Date();
    const expirationDate = (now.getTime() + 3600 * 1000).toString();
    localStorage.setItem('expirationDate', expirationDate);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  }

  public autoLogin(user: User) {
    this.user.next(user);
    this.router.navigate(['app/dashboard']);
  }

}