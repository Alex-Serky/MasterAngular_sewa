import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'al-login-form',
    templateUrl: './login-form.component.html',
    styles: [
    ]
})
export class LoginFormComponent implements OnInit {
    // On déclare le formulaire réactif
    loginForm: FormGroup;

    // On injecte le FormBuilder comme dépendance de notre composant
    constructor(
        private fb: FormBuilder,
        private router: Router) { }

    ngOnInit(): void {
        // On définit le formulaire
        this.loginForm = this.fb.group({
            'email': ['', [
                Validators.required,
                Validators.email
            ]],
            'password': ['', [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(20)
            ]]
        });
    }

    get email() { return this.loginForm.get('email') }
    get password() { return this.loginForm.get('password') }

    submit() {
        // On accède à toutes les valeurs du formulaire pour les afficher.

        console.info(this.email?.value);
        console.info(this.password?.value);
        this.router.navigate(['/app/dashboard']); // On redirige l'utilisateur vers le tableau de bord.
    }

}
