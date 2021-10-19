import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'login',
    // On définit la route asynchrone, grâce à la propriété loadChildren, et on lui passe comme valeur le chemin relatif et le nom de la classe de notre module paresseux
    loadChildren: () =>import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'login',
    loadChildren: () =>import('./register/register.module').then(m => m.RegisterModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
