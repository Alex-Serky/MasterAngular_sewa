import { NgModule } from '@angular/core';
// Remplacer l’importation du CommonModule par cette ligne :
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkdayRoutingModule } from './workday-routing.module';
import { WorkdayComponent } from './workday/workday.component';



@NgModule({
  declarations: [
    WorkdayComponent
  ],
  imports: [
    SharedModule,
    WorkdayRoutingModule
  ]
})
export class WorkdayModule { }
