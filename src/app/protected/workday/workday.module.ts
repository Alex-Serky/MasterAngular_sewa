import { NgModule } from '@angular/core';
// Remplacer l’importation du CommonModule par cette ligne :
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkdayComponent } from './workday/workday.component';



@NgModule({
  declarations: [
    WorkdayComponent
  ],
  imports: [
    SharedModule
  ]
})
export class WorkdayModule { }
