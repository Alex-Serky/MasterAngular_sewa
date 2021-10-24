import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'al-workday-form-tasks-item',
  templateUrl: './workday-form-tasks-item.component.html',
  styleUrls: ['./workday-form-tasks-item.component.scss']
})
export class WorkdayFormTasksItemComponent implements OnInit {

  @Input() task: FormGroup;
  @Input() index: number;
  @Input() isFirst: boolean;
  @Input() isLast: boolean;

  @Output() removedTask = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  // L'utilisateur demande à supprimer une tâche
  removeTask(index: number) {
    this.removedTask.emit(index);
  }

}
