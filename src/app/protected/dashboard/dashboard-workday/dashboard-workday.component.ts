import { Component, Input, OnInit } from '@angular/core';
import { Workday } from 'src/app/shared/models/workday';
import { interval, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'al-dashboard-workday',
  templateUrl: './dashboard-workday.component.html',
  styleUrls: ['./dashboard-workday.component.scss']
})
export class DashboardWorkdayComponent implements OnInit {

  @Input() workday: Workday;
  isPomodoroActive: boolean;
  startPomodoro$: Subject<string>;
  cancelPomodoro$: Subject<string>;
  completePomodoro$: Subject<string>;
  currentProgress: number;
  maxProgress: number;
  pomodoro$: Observable<number>;

  constructor() { }

  ngOnInit(): void {
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
      map(x => x + 1)
    );
  }

  startPomodoro() {
    this.isPomodoroActive = true;
    this.startPomodoro$.next('start');

    this.pomodoro$.subscribe(currentProgress => {
      this.currentProgress = currentProgress;
    });
  }

  cancelPomodoro() {
    this.isPomodoroActive = false;
    this.cancelPomodoro$.next('cancel');
  }

  completePomodoro() {
    this.isPomodoroActive = false;
    this.completePomodoro$.next('complete');
  }

}
