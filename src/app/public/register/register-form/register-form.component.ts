import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

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
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    // On définit le formulaire
    this.registerForm = this.fb.group({
      'name': ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9_-]*$')
      ]],
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'password': ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]]
    })
  }

  get name() { return this.registerForm.get('name') }
  get email() { return this.registerForm.get('email') }
  get password() { return this.registerForm.get('password') }

  submit() {
    // On accède à toutes les valeurs du formulaire pour les afficher.
    this.authService
    .register(this.name?.value, this.email?.value, this.password?.value)
    .subscribe(
      // On redirige l'utilisateur vers le tableau de bord.
      _ => this.router.navigate(['/app/dashboard']),
      _ => this.registerForm.reset()
    );
  }

}
