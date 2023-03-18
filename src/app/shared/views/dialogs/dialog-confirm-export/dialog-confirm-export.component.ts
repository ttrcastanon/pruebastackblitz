import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-confirm-export',
  templateUrl: './dialog-confirm-export.component.html',
  styleUrls: ['./dialog-confirm-export.component.scss']
})

/**
 * Diálogo para exportación de información
 */
export class DialogConfirmExportComponent implements OnInit {

  dataOptions: Array<any>;
  optionSelected: string;

  constructor(
    public dialogo: MatDialogRef<DialogConfirmExportComponent>,
    @Inject(MAT_DIALOG_DATA) public data_: any
  ) {
  }

  ngOnInit() {

    this.dataOptions = [
      {
        "Id": 1,
        "Text": `${this.data_.titulo} sólo registros de la página actual`
      },
      {
        "Id": 2,
        "Text": `${this.data_.titulo} todos los registros`
      }
    ];
  }

  /**
   * Cancelar exportación
   */
  CancelExport(): void {
    this.dialogo.close(false);
  }

  /**
   * Exportando información
   */
  ConfirmExport(): void {
    if (this.optionSelected == undefined) {
      alert('Es necesario seleccionar una opción');
      return;
    }
    this.dialogo.close(this.optionSelected);
  }

}
