import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesSettingComponent } from '../business-rules-setting/business-rules-setting.component';

@Component({
  selector: 'app-business-rules',
  templateUrl: './business-rules.component.html',
  styleUrls: ['./business-rules.component.scss']
})
export class BusinessRulesComponent implements OnInit {

  public listConfig = {
    columns: [
      "acciones",
      "folio",
      "nombre_completo",
      "departamento",
      "area",
      "fecha_de_registro",
      "hora_de_registro",
      "sueldo",
      "estatura",
      "activo",
      "fotografia",
      "curriculum",
    ],
    columns_filters: [
      "acciones_filtro",
      "folio_filtro",
      "nombre_completo_filtro",
      "departamento_filtro",
      "area_filtro",
      "fecha_de_registro_filtro",
      "hora_de_registro_filtro",
      "sueldo_filtro",
      "estatura_filtro",
      "activo_filtro",
      "fotografia_filtro",
      "curriculum_filtro",
    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Nombre_Completo: "",
      Departamento: "",
      Area: "",
      Sueldo: "",
      Estatura: "",
      Fecha_de_Registro: null,
      Hora_de_Registro: "",
      Activo: "",
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha_de_Registro: "",
      toFecha_de_Registro: "",
      fromHora_de_Registro: "",
      toHora_de_Registro: "",
      fromEstatura: "",
      toEstatura: "",
      fromSueldo: "",
      toSueldo: "",
      departamentoFilter: "",
      departamento: "",
      departamentoMultiple: ""

    }
  };

  constructor(
    public dialogoRef: MatDialogRef<BusinessRulesComponent>,
    public matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: string,
    public _file : SpartanFileService
  ) { }

  ngOnInit(): void {
  }

  ActionAddRule() {
    
    // let dataRow = '';
    // this.matDialog
    // .open(BusinessRulesSettingComponent, {
    //   data: dataRow,
    //   width: '80%',
    //     minHeight: 'calc(90vh - 90px)',
    //     height : 'auto'
    // })
    // .afterClosed()
    // .subscribe((optionSelected: boolean) => {
    //   if (optionSelected) {
    //     alert('Pendiente de implementar.');
    //   }
    // });

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      'top': '40px',
      left: '20px'
    };
    dialogConfig.height = '85%';
    dialogConfig.width = '80%';
    dialogConfig.minHeight = 'calc(80vh - 40px)';
    // dialogConfig.maxWidth = '90vh';
    dialogConfig.data = {
      id: 1,
      title: 'Angular For Beginners'
    };

    const dialogRef = this.matDialog.open(BusinessRulesSettingComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => console.log("Dialog output:", data)
    );
    
  }

  ActionClose() {
    this.dialogoRef.close(false);
  }

}