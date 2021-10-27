import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

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
        private router: Router,
        private authService: AuthService,) { }

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
        this.authService
            .login(this.email?.value, this.password?.value)
            .subscribe(
                _ => this.router.navigate(['/app/dashboard']), // On redirige l'utilisateur vers le tableau de bord.
                _ => this.loginForm.reset() // On efface les données éronnées dans le formulaire avec reset
            );
    }

}
