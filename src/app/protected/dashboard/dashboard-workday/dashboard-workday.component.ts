import { Component, Input, OnInit } from '@angular/core';
import { Workday } from 'src/app/shared/models/workday';

@Component({
  selector: 'al-dashboard-workday',
  templateUrl: './dashboard-workday.component.html',
  styleUrls: ['./dashboard-workday.component.scss']
})
export class DashboardWorkdayComponent implements OnInit {

  @Input() workday: Workday;
  isPomodoroActive: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isPomodoroActive = false;
  }

  startPomodoro() {
    this.isPomodoroActive = true;
  }

  cancelPomodoro() {
    this.isPomodoroActive = false;
  }

  completePomodoro() {
    this.isPomodoroActive = false;
  }

}
