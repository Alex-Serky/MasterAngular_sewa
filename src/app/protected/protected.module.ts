import { NgModule } from '@angular/core';
// Remplacer l’importation du CommonModule par cette ligne :
import { SharedModule } from 'src/app/shared/shared.module';

import { ProtectedRoutingModule } from './protected-routing.module';


@NgModule({
  declarations: [],
  imports: [
    // Impoter le SharedModule plutôt que le CommonModule :
    SharedModule,
    ProtectedRoutingModule
  ]
})
export class ProtectedModule { }
