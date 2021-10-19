import { NgModule } from '@angular/core';
// Remplacer l'importation du CommonModule par cette ligne :
import { SharedModule } from 'src/app/shared/shared.module';
import { ProtectedRoutingModule } from './protected-routing.module';
import { ProtectedComponent } from './protected.component';


@NgModule({
  declarations: [
    ProtectedComponent
  ],
  imports: [
    // Importer le SharedModule plutôt que le CommonModule :
    SharedModule,
    ProtectedRoutingModule
  ]
})
export class ProtectedModule { }
