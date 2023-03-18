import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Utilidad } from './Utilidad';


export class Detalle_Politicas_Terceros  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Politicas = 0;
    @FormField('importe_desde', [''])
    importe_desde = null;
    @FormField('importe_hasta', [''])
    importe_hasta = null;
    @FormField('Porcentaje_de_Utilidad_Minimo', [''])
    Porcentaje_de_Utilidad_Minimo = null;
    Porcentaje_de_Utilidad_Minimo_Utilidad: Utilidad;

     @FormField('Detalle_Politicas_Terceross', [''])
     Detalle_Politicas_Terceross: Detalle_Politicas_Terceros[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

