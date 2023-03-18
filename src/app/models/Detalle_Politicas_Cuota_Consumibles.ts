import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_Politicas_Cuota_Consumibles  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Costo_Desde', [''])
    Costo_Desde = null;
    @FormField('Costo_Hasta', [''])
    Costo_Hasta = null;
    @FormField('Cuota_Monto', [''])
    Cuota_Monto = null;
    @FormField('Cuota_Minima_Porcentaje', [0])
    Cuota_Minima_Porcentaje = null;
    @FormField('Tope_Maximo', [''])
    Tope_Maximo = null;

     @FormField('Detalle_Politicas_Cuota_Consumibless', [''])
     Detalle_Politicas_Cuota_Consumibless: Detalle_Politicas_Cuota_Consumibles[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

