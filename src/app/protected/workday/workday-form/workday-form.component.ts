import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { WorkdaysService } from 'src/app/core/services/workdays.service';
import { Workday } from 'src/app/shared/models/workday';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'al-workday-form',
  templateUrl: './workday-form.component.html',
  styles: [
  ]
})
export class WorkdayFormComponent implements OnInit {

  workdayId: string | null; // Permet de faire la distinction entre l'ajout et l'édition
  workdayForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private workdaysService: WorkdaysService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.workdayId = '';
    this.workdayForm = this.createWorkdayForm();

  }

  get dueDate() { return this.workdayForm.get('dueDate') as FormControl; }
  get notes() { return this.workdayForm.get('notes') as FormControl; }
  get tasks() { return this.workdayForm.get('tasks') as FormArray; }

  createWorkdayForm(): FormGroup {
    const workdayForm: FormGroup = this.fb.group({
      dueDate: ['', [
      Validators.required
      ]],
      tasks: this.fb.array([], [
      Validators.required,
      Validators.maxLength(6)
      ]),
      notes: ['', [
      Validators.maxLength(1000)
      ]]
    });
    return workdayForm;
  }

  submit(): void {
    const user: User|null = this.authService.currentUser;

    if(!(user && user.id)) {
      return;
    }

    // Update workday
    if(this.workdayId) {
      const workdayToUpdate: Workday = new Workday({...{userId: user.id }, ...{id: this.workdayId }, ...this.workdayForm.value});

      this.workdaysService.update(workdayToUpdate).subscribe(
        _ => this.router.navigate(['/app/planning']),
        _ => this.workdayForm.reset()
      );
      return;
    }

    // Create workday
    const workdayToCreate = new Workday({...{userId: user.id }, ...this.workdayForm.value});
    this.workdaysService.save(workdayToCreate).subscribe(
      _ => this.router.navigate(['/app/planning']),
      _ => this.workdayForm.reset()
    );
  }


  /**
   * Permet de vider le formulaire
   */
  resetWorkdayForm() {
    while(this.tasks.length !== 0) {
      this.tasks.removeAt(0);
    }
    this.notes.reset(); // Vider le champ notes
  }

  /**
   * Permet de traiter le cas où l'utilisateur sélectionne une nouvelle journée de travail.
   * @param displayDate
   */
  onDateSelected(displayDate: string) {
    const user: User|null = this.authService.currentUser; // On va récupérer la journée de travail par date pour l'utilisateur courant seulement.

    if(user && user.id) {
      this.workdaysService.getWorkdayByDate(displayDate, user.id).subscribe(workday => {
        this.resetWorkdayForm(); // On réinitialise le formulaire d'une journée de travail.
        if(!workday) return; // Si cette journée de travail n'existe pas sur le Firestore, alors on s'arrête là.

        this.workdayId = workday.id; // On récupère l'identifiant du workday
        this.notes.setValue(workday.notes); // Attribuer une nouvelle valeur au champ notes
        workday.tasks.forEach(task => {
        const taskField: FormGroup = this.fb.group({
          title: task.title,
          todo: task.todo,
          done: task.done
        });
        this.tasks.push(taskField);
        });
      });
    }
  }

}
