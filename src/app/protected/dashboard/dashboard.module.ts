import { NgModule } from '@angular/core';
// Remplacer l'importation du CommonModule par cette ligne :
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardPomodoroProgressComponent } from './dashboard-pomodoro-progress/dashboard-pomodoro-progress.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardPomodoroProgressComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
