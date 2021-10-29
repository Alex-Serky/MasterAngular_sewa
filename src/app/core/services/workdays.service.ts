import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // On importe le client Http d'Angular.
import { Workday } from 'src/app/shared/models/workday'; // On importe notre modèle métier Workday.

@Injectable({
  providedIn: 'root'
})
export class WorkdaysService {

  constructor(private http: HttpClient) { }

  save(workday: Workday) {

    // Pousser la journée de travail passé en paramètre au Firestore.
    const url = `${environment.firebase.firestore.baseURL}/workdays?key=${environment.firebase.apiKey}`;
    const data = this.getWorkdayForFirestore(workday); // C'est cette ligne qui est un peu plus costaud que d'habitude...
    const jwt: string = localStorage.getItem('token')!;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${jwt}`
      })
    };
    return this.http.post(url, data, httpOptions);
  }

  // Pousser le modèle métier d'une journée de travail au Firestore.
  private getWorkdayForFirestore(workday: Workday): any {
    if(typeof workday.dueDate === 'string') {
      workday.dueDate = +workday.dueDate; // L'opérateur « + » permet de convertir en un nombre
    }
    const date: number = new Date(workday.dueDate).getTime();
    const tasks: Object = this.getTaskListForFirestore(workday.tasks);

    return {
      fields: {
        dueDate: { integerValue: date },
        tasks: tasks,
        notes: { stringValue: workday.notes },
        userId: { stringValue: workday.userId }
      }
    };
  }

  // Mise en place de la liste des tâches d'une journée de travail, pour le Firestore.
  private getTaskListForFirestore(tasks: Task[]): any {
    const taskList: any = {
      arrayValue: {
      values: []
      }
    };

    tasks.forEach(task => taskList.arrayValue.values.push(this.getTaskForFirestore(task)));

    return taskList;
  }

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