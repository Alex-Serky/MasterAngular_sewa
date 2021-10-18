import { NgModule } from '@angular/core';
// Remplacer l’importation du CommonModule par cette ligne :
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    SharedModule
  ]
})
export class LoginModule { }
