import { NgModule } from '@angular/core';
// Remplacer l'importation du CommonModule par cette ligne :
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login/login.component';
import { LoginRoutingModule } from './login/login-routing.module';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    SharedModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
