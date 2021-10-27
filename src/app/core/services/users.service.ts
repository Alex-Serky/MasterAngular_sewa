import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/shared/models/user';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  save(user: User, jwt: string): Observable<User|null> {
    const url =
    `${environment.firebase.firestore.baseURL}/users?key=
      ${environment.firebase.apiKey}&documentId=${user.id}`;

    // Cette méthode permet de faire le mapping entre notre objet métier User, et les données attendues par le Firestore
    const data = this.getDataForFirestore(user);
    const httpOptions = {
      // On ajoute une en-tête supplémentaire pour notre requête
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${jwt}`
      })
    };

    return this.http.post(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        // On réémet les informations de l'utilisateur dans un Observable, grâce à l'opérateur of.
        return of(this.getUserFromFirestore(data.fields));
      })
    );
  }

  private getUserFromFirestore(fields: any): User {
    return new User({
      id: fields.id.stringValue,
      email: fields.email.stringValue,
      pomodoroDuration: fields.pomodoroDuration.integerValue,
      name: fields.name.stringValue,
      avatar: fields.avatar.stringValue
    });
  }

  private getDataForFirestore(user: User): Object {
    return {
      fields: {
      id: { stringValue: user.id },
      email: { stringValue: user.email },
      name: { stringValue: user.name },
      avatar: { stringValue: user.avatar },
      pomodoroDuration: { integerValue: user.pomodoroDuration }
      }
    };
  }
}