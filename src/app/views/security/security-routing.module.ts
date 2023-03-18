import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PermissionsComponent } from "./permissions/permissions.component";

const routes: Routes = [
  {
    path: "permissions",
    component: PermissionsComponent,
  },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class securityRoutingModule {}
