import { NgModule } from '@angular/core';
// Remplacer l’importation du CommonModule par cette ligne :
import { SharedModule } from 'src/app/shared/shared.module';
import { PlanningRoutingModule } from './planning-routing.module';

import { PlanningWorkdayListComponent } from './planning-workday-list/planning-workday-list.component';
import { PlanningWorkdayItemComponent } from './planning-workday-item/planning-workday-item.component';


@NgModule({
  declarations: [
    PlanningWorkdayListComponent,
    PlanningWorkdayItemComponent
  ],
  imports: [
    SharedModule,
    PlanningRoutingModule
  ],
  exports: [
    PlanningWorkdayListComponent,
    PlanningWorkdayItemComponent
  ],
})
export class PlanningModule { }
