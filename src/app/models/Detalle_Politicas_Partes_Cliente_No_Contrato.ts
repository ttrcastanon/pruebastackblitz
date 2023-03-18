import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_Politicas_Partes_Cliente_No_Contrato  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Politicas = 0;
    @FormField('Costo_Desde', [''])
    Costo_Desde = null;
    @FormField('Costo_Hasta', [''])
    Costo_Hasta = null;
    @FormField('cargo_minimo', [0])
    cargo_minimo = null;

     @FormField('Detalle_Politicas_Partes_Cliente_No_Contratos', [''])
     Detalle_Politicas_Partes_Cliente_No_Contratos: Detalle_Politicas_Partes_Cliente_No_Contrato[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

