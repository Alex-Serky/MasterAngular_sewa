import { Component, Input, OnInit } from '@angular/core';
import { Workday } from 'src/app/shared/models/workday';
import { interval, Observable, Subject, of } from 'rxjs';
import { map, takeUntil, delay, takeWhile } from 'rxjs/operators';
import { Task } from 'src/app/shared/models/task';
import { WorkdaysService } from 'src/app/core/services/workdays.service';

@Component({
  selector: 'al-dashboard-workday',
  templateUrl: './dashboard-workday.component.html',
  styleUrls: ['./dashboard-workday.component.scss']
})
export class DashboardWorkdayComponent implements OnInit {

  @Input() workday: Workday;
  isWorkdayComplete: boolean;
  isPomodoroActive: boolean;
  startPomodoro$: Subject<string>;
  cancelPomodoro$: Subject<string>;
  completePomodoro$: Subject<string>;
  currentProgress: number;
  maxProgress: number;
  pomodoro$: Observable<number>;
  currentTask: Task|undefined;

  constructor(private workdaysService: WorkdaysService) { }

  ngOnInit(): void {
    this.isWorkdayComplete = (this.getCurrentTask() === undefined);
    this.isPomodoroActive = false;
    this.startPomodoro$ = new Subject();
    this.cancelPomodoro$ = new Subject();
    this.completePomodoro$ = new Subject();
    this.currentProgress = 0
    this.maxProgress = 5;
    this.pomodoro$ = interval(1000).pipe(
      // On se désabonne du flux d'un pomodoro au bon moment (takeUntil())
      takeUntil(this.cancelPomodoro$),
      takeUntil(this.completePomodoro$),
      // On se désabonne du flux dès que le pomodoro se termine.
      takeWhile(progress => progress <= this.maxProgress),
      map(x => x + 1)
    );
  }

  startPomodoro() {
    this.isPomodoroActive = true;
    this.startPomodoro$.next('start');

    this.pomodoro$.subscribe(currentProgress => {
      this.currentProgress = currentProgress;
      if(currentProgress === this.maxProgress) {
        // On vérifie que le pomodoro en cours est terminé, on attend 500 ms
        of(0).pipe(delay(500)).subscribe(_ => this.completePomodoro())
      }
    });
  }

  cancelPomodoro() {
    this.isPomodoroActive = false;
    this.cancelPomodoro$.next('cancel');
  }

  completePomodoro() {
    this.completePomodoro$.next('complete');
    this.isPomodoroActive = false;

    // On récupére la tâche courante.
    this.currentTask = this.getCurrentTask();

    // On incrémente la tâche courante.
    if(this.currentTask) {
      this.currentTask.done++;
    }

    // On vérifie si la journée de travail est terminée.
    this.isWorkdayComplete = (this.getCurrentTask() === undefined);

  }

  getCurrentTask(): Task|undefined {
    return this.workday.tasks.find(task => task.todo > task.done) // find retourne le 1er élément du tableau.
  }

}
