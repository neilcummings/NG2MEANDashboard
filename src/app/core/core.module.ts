import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavComponent} from './nav/nav.component';
import {appRoutes} from '../routes';
import {RouterModule} from '@angular/router';
import {BsDropdownModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {UserService} from '../_services/user.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes),
    BsDropdownModule.forRoot(),
    FormsModule
  ],
  declarations: [NavComponent],
  exports: [
    NavComponent,
    RouterModule
  ],
  providers: [
    UserService
  ]
})

export class CoreModule { }
