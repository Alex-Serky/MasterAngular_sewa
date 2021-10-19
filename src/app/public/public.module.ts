import { NgModule } from '@angular/core';
// Remplacer l’importation du CommonModule par cette ligne :
import { SharedModule } from 'src/app/shared/shared.module';
import { PublicRoutingModule } from './public-routing.module';
import { HomeModule } from './home/home.module';
import { RegisterModule } from './register/register.module';

@NgModule({
  declarations: [],
  imports: [
    // Impoter le SharedModule plutôt que le CommonModule :
    SharedModule,
    PublicRoutingModule,
    HomeModule,
    RegisterModule
  ]
})
export class PublicModule { }
