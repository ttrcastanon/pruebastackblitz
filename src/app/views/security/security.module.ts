import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsModule } from './permissions/permissions.module';
import { securityRoutingModule } from './security-routing.module';



@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    PermissionsModule,
    securityRoutingModule
  ]
})
export class SecurityModule { }
