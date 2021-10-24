import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'al-workday-form-tasks',
  templateUrl: './workday-form-tasks.component.html',
  styles: []
})
export class WorkdayFormTasksComponent implements OnInit {

  @Input() tasks: FormArray;
  @Input() workdayForm: FormGroup;


  taskControlList: FormGroup[];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.taskControlList = this.tasks.controls as FormGroup[];
  }

  // Méthode qui permet d'instancier un nouveau FormGroup contenant simplement un titre de tâche vide
  onAddedTask() {
    const taskGroup: FormGroup = this.fb.group({
      'title': ''
    });
    this.tasks.push(taskGroup);
  }

  onRemovedTask(index: number) {
    this.tasks.removeAt(index);
  }

}
