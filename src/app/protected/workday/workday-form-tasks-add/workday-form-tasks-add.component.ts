import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'al-workday-form-tasks-add',
  templateUrl: './workday-form-tasks-add.component.html',
  styles: [
  ]
})
export class WorkdayFormTasksAddComponent implements OnInit {

  // Ajouter une émission d'événement
  @Output() addedTask = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  // Méthode permettant de déclencher l'émission d'un événement
  addTask() {
    this.addedTask.emit();
  }

}
