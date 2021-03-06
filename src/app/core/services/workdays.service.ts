import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Workday } from 'src/app/shared/models/workday';
import { environment } from 'src/environments/environment';
import { Task } from 'src/app/shared/models/task';
import { ToastrService } from './toastr.service';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { Observable, of } from 'rxjs';
import { tap, catchError, finalize, switchMap } from 'rxjs/operators';
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root'
})
export class WorkdaysService {

  constructor(
    private http: HttpClient,
    private dateService: DateService,
    private toastrService: ToastrService,
    private errorService: ErrorService,
    private loaderService: LoaderService) { }

  /**
   *
   * @param workday
   * @returns
   */
  save(workday: Workday) {

    // Pousser la journée de travail passé en paramètre au Firestore.
    const url = `${environment.firebase.firestore.baseURL}/workdays?key=${environment.firebase.apiKey}`;
    const data = this.getWorkdayForFirestore(workday); // C'est cette ligne qui est un peu plus costaud que d'habitude...

    this.loaderService.setLoading(true);

    return this.http.post(url, data, {}).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Votre journée de travail a été enregistrée avec succès.'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  /**
   * Permet de pousser la modification effectuée sur une journée de travail vers le Firestore.
   * @param workday
   * @returns
   */
  update(workday: Workday) {
    const url = `${environment.firebase.firestore.baseURL}/workdays/${workday.id}?key=${environment.firebase.apiKey}&currentDocument.exists=true`;
    const data = this.getWorkdayForFirestore(workday);

    return this.http.patch(url, data, {}).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Votre journée de travail a été sauvegardée avec succès.'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  /**
   * Requête de type POST
   */
  getWorkdayByUser(userId: string): any {
    const url = `${environment.firebase.firestore.baseURL}:runQuery?key=${environment.firebase.apiKey}`;
    const data = this.getWorkdayByUserQuery(userId);

    return this.http.post(url, data, {}).pipe(
      switchMap((workdaysData: any) => {
        const workdays: Workday[] = [];
        workdaysData.forEach((data: any) => {
          if (data && data.document) {
            const workday: Workday = this.getWorkdayFromFirestore(data.document.name, data.document.fields);
            workdays.push(workday);
          }
        })
        return of(workdays);
      }),
      catchError(error => this.errorService.handleError(error))
    );
  }

  /**
   * Permet de supprimer la journée de travail sur le Firestore.
   */
  remove(workday: Workday) {
    const url = `${environment.firebase.firestore.baseURL}/workdays/${workday.id}?key=${environment.firebase.apiKey}`;

    return this.http.delete(url, {}).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Votre journée de travail a été supprimé avec succès.'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  /**
   *
   * @param date
   * @param userId
   * @returns
   */
  getWorkdayByDate(date: string, userId: string): Observable<Workday|null> {
    const url = `${environment.firebase.firestore.baseURL}:runQuery?key=${environment.firebase.apiKey}`;
    const data = this.getStructuredQuery(date, userId);

    return this.http.post(url, data, {}).pipe(
      switchMap((data: any) => {
        const document = data[0].document;
        if(!document) {
          return of(null);
        }

        // console.log('getWorkdayByDate');
        // console.log(this.getWorkdayFromFirestore(document.name, document.fields));

        return of(this.getWorkdayFromFirestore(document.name, document.fields));
      })
    );
  }

  /**
   * Cette méthode permet de définir les critères de sélection de mes journées de travail auprès du Firestore.
   * @param userId
   * @returns
   */
  private getWorkdayByUserQuery(userId: string): any {
    return {
      'structuredQuery': {
        'from': [{
          'collectionId': 'workdays'
        }],
        'where': {
          'fieldFilter': {
            'field': { 'fieldPath': 'userId' },
            'op': 'EQUAL',
            'value': { 'stringValue': userId }
          }
        },
        "orderBy": [{
          "field": {
            "fieldPath": "dueDate"
          },
          "direction": "DESCENDING"
        }]
      }
    };
  }

  /**
   * Méthode qui permet de fournir les informations nécessaires à notre requête pour le Firestore.
   * @param date
   * @param userId
   * @returns
   */
  private getStructuredQuery(date: string, userId: string): any {
    return {
      'structuredQuery': {
        'from': [{
          'collectionId': 'workdays'
        }],
        'where': {
          'compositeFilter': {
            'op': 'AND',
            'filters': [
              {
                'fieldFilter': {
                  'field': { 'fieldPath': 'displayDate' },
                  'op': 'EQUAL',
                  'value': { 'stringValue': date }
                }
              },
              {
                'fieldFilter': {
                  'field': { 'fieldPath': 'userId' },
                  'op': 'EQUAL',
                  'value': { 'stringValue': userId }
                }
              }
            ]
          }
        },
        'limit': 1
      }
    };
  }

  /**
   * Gérer la récupération des données brutes stockées dans le Firestore pour en faire un modèle métier dans notre application.
   * @param name
   * @param fields
   * @returns
   */
  private getWorkdayFromFirestore(name: string, fields: any): Workday {
    const tasks: Task[] = [];
    const workdayId: string = name.split('/')[6];

    fields.tasks.arrayValue.values.forEach((data: any) => {
      const task: Task = new Task({
        completed: data.mapValue.fields.completed.booleanValue,
        done: data.mapValue.fields.done.integerValue,
        title: data.mapValue.fields.title.stringValue,
        todo: data.mapValue.fields.todo.integerValue
      });
      tasks.push(task);
    });

    // Cette méthode retourne un modèle métier Workday
    return new Workday({
      id: workdayId,
      userId: fields.userId.stringValue,
      notes: fields.notes.stringValue,
      displayDate: fields.displayDate.stringValue,
      dueDate: fields.dueDate.integerValue,
      tasks: tasks
    });
  }

  /**
   * Pousser le modèle métier d'une journée de travail au Firestore.
   * @param workday
   * @returns
   */
  private getWorkdayForFirestore(workday: Workday): any {
    let dueDate: number; // Timestamp traditionnelle en secondes.
    let dueDateMs: number; // Timestamp JavaScript en millisecondes.

    if(typeof workday.dueDate == 'string') {
      dueDate = +workday.dueDate;
      dueDateMs = dueDate * 1000;
    } else {
      dueDate = new Date(workday.dueDate).getTime() / 1000;
      dueDateMs = dueDate * 1000;
    }

    // La nouvelle propriété displayDate est prise en compte.
    const displayDate: string = this.dateService.getDisplayDate(new Date(dueDateMs));
    const tasks: Object = this.getTaskListForFirestore(workday.tasks);

    return {
      fields: {
        dueDate: { integerValue: Math.trunc(dueDate) },
        displayDate: { stringValue: displayDate },
        tasks: tasks,
        notes: { stringValue: workday.notes },
        userId: { stringValue: workday.userId }
      }
    };
  }

  /**
   * Mise en place de la liste des tâches d'une journée de travail, pour le Firestore.
   */
  private getTaskListForFirestore(tasks: Task[]): any {
    const taskList: any = {
      arrayValue: {
      values: []
      }
    };

    tasks.forEach(task => taskList.arrayValue.values.push(this.getTaskForFirestore(task)));

    return taskList;
  }

  /**
   *
   */
  private getTaskForFirestore(task: Task): any {
    return {
      mapValue: {
        fields: {
          title: { stringValue: task.title },
          todo: { integerValue: task.todo },
          done: { integerValue: task.done },
          completed: { booleanValue: false }
        }
      }
    }
  }

}