import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

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

  constructor() {}

  ngOnInit(): void {}

  get todo() {
    return this.task.get('todo') as FormControl;
  }

  /**
   * L'utilisateur demande à supprimer une tâche
   * @param index
   */
  removeTask(index: number) {
    this.removedTask.emit(index);
  }

  // Prendre un nombre de pomodoros en paramètre et mettre à jour cette information
  selectTodo(todo: number) {
    this.task.patchValue({todo: todo});
  }

}
