import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UsersService } from 'src/app/core/services/users.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: BehaviorSubject<User|null> = new BehaviorSubject<User|null>(null);
  readonly user$: Observable<User|null> = this.user.asObservable();

  constructor(
    private http: HttpClient,
    private usersService: UsersService) { }

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

    return this.http.post<User>(url, data, httpOptions).pipe(
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
      tap(user => this.user.next(user)) // Pousser l'utilisateur qui vient de s'inscrire dans l'état du service.
    );
  }

}