import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeModule } from './home/home.module';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PublicRoutingModule,
    HomeModule,
    RegisterModule,
    LoginModule
  ]
})
export class PublicModule { }
