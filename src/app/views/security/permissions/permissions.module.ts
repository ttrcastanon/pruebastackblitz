import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PermissionsComponent } from "./permissions.component";
import {
  DialogContentRole,
  ModulesComponent,
  DialogContentModule
} from "./modules/modules.component";
import { ModulesObjectsComponent } from "./modules-objects/modules-objects.component";
import { ModulesPermissionsComponent } from "./modules-permissions/modules-permissions.component";
import { MatSelectModule } from "@angular/material/select";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatTreeModule } from "@angular/material/tree";
import { ModuleTreeComponent } from "./modules/module-tree/module-tree.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ModuleTreeService } from '../../../api-services/module-tree.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslatePipe } from "@ngx-translate/core";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [
    PermissionsComponent,
    ModulesComponent,
    ModulesObjectsComponent,
    ModulesPermissionsComponent,
    DialogContentRole,
    DialogContentModule,
    ModuleTreeComponent,
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatTreeModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    SharedModule
  ],
  providers: [
    ModuleTreeService
  ]
})
export class PermissionsModule {}
