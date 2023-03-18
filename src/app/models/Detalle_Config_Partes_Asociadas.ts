import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Piezas } from './Piezas';
import { Unidad } from './Unidad';


export class Detalle_Config_Partes_Asociadas  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Configuracion = 0;
    @FormField('Numero_de_Parte', [''])
    Numero_de_Parte = null;
    Numero_de_Parte_Piezas: Piezas;
    @FormField('Cantidad', [0])
    Cantidad = null;
    @FormField('Unidad', [''])
    Unidad = null;
    Unidad_Unidad: Unidad;

     @FormField('Detalle_Config_Partes_Asociadass', [''])
     Detalle_Config_Partes_Asociadass: Detalle_Config_Partes_Asociadas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

