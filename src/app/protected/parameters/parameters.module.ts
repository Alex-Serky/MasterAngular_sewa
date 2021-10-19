import { NgModule } from '@angular/core';
// Remplacer l'importation du CommonModule par cette ligne :
import { SharedModule } from 'src/app/shared/shared.module';
import { ParametersRoutingModule } from './parameters-routing.module';
import { ParametersComponent } from './parameters/parameters.component';


@NgModule({
  declarations: [
    ParametersComponent
  ],
  imports: [
    SharedModule,
    ParametersRoutingModule
  ]
})
export class ParametersModule { }
