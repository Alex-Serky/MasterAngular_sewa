import { NgModule } from '@angular/core';
// Remplacer l’importation du CommonModule par cette ligne :
import { SharedModule } from 'src/app/shared/shared.module';
import { RegisterComponent } from './register/register.component';



@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    SharedModule
  ]
})
export class RegisterModule { }
