import { NgModule } from '@angular/core';
// Remplacer l'importation du CommonModule par cette ligne :
import { SharedModule } from 'src/app/shared/shared.module';
import { PublicRoutingModule } from './public-routing.module';
import { HomeModule } from './home/home.module';

@NgModule({
  declarations: [],
  imports: [
    // Importer le SharedModule plutôt que le CommonModule :
    SharedModule,
    PublicRoutingModule,
    HomeModule
  ]
})
export class PublicModule { }
