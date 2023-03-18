import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpartanFormatService } from 'src/app/api-services/spartan-format.service';
import { SpartanFormatPermissionsService } from 'src/app/api-services/spartan-format-permissions.service';
import { SpartanFormatPermissionsModel, SpartanFormatPermissionsPagingModel } from 'src/app/models/spartan-format-permissions.model';
import { SpartanFormatModel, SpartanFormatPagingModel } from 'src/app/models/spartan-format.model';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';

@Component({
  selector: 'app-dialog-print-format',
  templateUrl: './dialog-print-format.component.html',
  styleUrls: ['./dialog-print-format.component.scss']
})
export class DialogPrintFormatComponent implements OnInit {

  empleado: string;
  // FormatList: Array<SpartanFormatModel>;
  // FormatList: SpartanFormatPagingModel;
  FormatPermissionsList: any;
  FormatList: any;
  optionSelected: string;
  formatSelected = []

  constructor(
    public dialogo: MatDialogRef<DialogPrintFormatComponent>,
    private formatPermissionsService: SpartanFormatPermissionsService,
    private formatService: SpartanFormatService,
    protected localStorageHelper: LocalStorageHelper
  ) {
  }

  ngOnInit(): void {
    this.empleado = "";
    //this.GetDymmyFormats(); //Mostrar estos de forma temporal
    this.GetPermissions(+this.localStorageHelper.getItemFromLocalStorage("FolioPrint")); //Cuando la tabla de formatos tenga informacion, mostrar estos
  }

  /**
   * Cancelar exportación
   */
  CancelPrint(): void {
    // this.dialogo.close(this.optionSelected);
    this.dialogo.close(false);
  }

  /**
   * Exportando información
   */
  ConfirmPrint(): void {
    if (this.optionSelected == undefined) {
      alert('Es necesario seleccionar una opción');
      return;
    }
    else {
      this.FormatList.forEach(element => {
        if (this.optionSelected == element.FormatId) {
          this.formatSelected.push({
            Format: this.optionSelected,
            Name: element.Format_Name
          })
        }
      });
    }

    this.dialogo.close(this.formatSelected);
    //this.dialogo.close(this.optionSelected);
  }

  /**
   * Obtener Formatos
   */
  GetFormats(where: string, recordId: number) {

    let startRowIndex: number = 0;
    let maximumRows: number = 1000;
    // let where: string = '';
    let order: string = '';
    let that = this;

    this.formatService.ListaSelAll(startRowIndex, maximumRows, where, order)
      .subscribe((data: SpartanFormatPagingModel) => {
        if (data.RowCount > 0) {
          that.FormatList = data.Spartan_Formats;
          if (that.FormatList.length > 0) {
            that.FormatList.forEach(format => {
              if (format.Filter != null && format.Filter.trim() != '') {
                var where = format.Filter.trim() + " And A_Tiempo.Clave= " + recordId;
                //TODO: Invocar api del objeto => ListaSelAll(0, 1000, where, string.Empty);
                //TODO: El result final deberá traer los datos de los formatos
              }
            });
          }
        }
      })

  }

  /**
   * Obtener Formatos DUMMY
   */
  GetDymmyFormats() {

    this.formatService.GetDummySpartanFormat().subscribe((data: SpartanFormatModel[]) => {
      this.FormatList = data;
    })

  }

  /***
   * Obtener permisos sobre formatos
   */
  GetPermissions(recordId: number) {

    const user = this.localStorageHelper.getLoggedUserInfo();

    let startRowIndex: number = 0;
    let maximumRows: number = 500;
    let where: string = ` Spartan_Format_Permissions.Spartan_User_Role = ${user.RoleId} AND Spartan_Format_Permissions.Permission_Type = 1 AND Apply=1 `;
    let order: string = '';
    let that = this;

    this.formatPermissionsService.ListaSelAll(startRowIndex, maximumRows, where, order)
      .subscribe((data: SpartanFormatPermissionsPagingModel) => {
        if (data.RowCount > 0) {
          let ListPrint = [];
          data.Spartan_Format_Permissionss.forEach(item => {
            ListPrint.push(item.Format_Spartan_Format);
          });
          this.FormatList = ListPrint;
          /*const formats = data.Spartan_Format_Permissionss.filter(f => f.Format).join(',');
          var whereClauseFormat = "Object = 45017 AND FormatId in (" + formats + ")";
          this.GetFormats(whereClauseFormat, recordId);*/
        }
      })

  }

}
