import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'al-register-form',
  templateUrl: './register-form.component.html',
  styles: [
  ]
})
export class RegisterFormComponent implements OnInit {
  // On déclare le formulaire réactif
  registerForm: FormGroup;

  // On injecte le FormBuilder comme dépendance de notre composant
  constructor(
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    // On définit le formulaire
    this.registerForm = this.fb.group({
      'name': '',
      'email': '',
      'password': ''
    })
  }

  get name() { return this.registerForm.get('name') }
  get email() { return this.registerForm.get('email') }
  get password() { return this.registerForm.get('password') }

  submit() {
    // On accède à toutes les valeurs du formulaire pour les afficher.
    console.info(this.name?.value);
    console.info(this.email?.value);
    console.info(this.password?.value);
    this.router.navigate(['/app/dashboard']); // On redirige l'utilisateur vers le tableau de bord.
  }

}
