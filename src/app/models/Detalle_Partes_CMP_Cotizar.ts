import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Piezas } from './Piezas';
import { Unidad } from './Unidad';
import { Utilidad } from './Utilidad';
import { Tipo_de_Condicion_Parte } from './Tipo_de_Condicion_Parte';


export class Detalle_Partes_CMP_Cotizar  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    CMP_a_Cotizar = 0;
    @FormField('Numero_de_Parte', [''])
    Numero_de_Parte = null;
    Numero_de_Parte_Piezas: Piezas;
    @FormField('Ultimo_Costo_Cotizado', [''])
    Ultimo_Costo_Cotizado = null;
    @FormField('Parte__Material_conseguida', [false])
    Parte__Material_conseguida = false;
    @FormField('Costo_Original', [''])
    Costo_Original = null;
    @FormField('Costo_de_Parte', [''])
    Costo_de_Parte = null;
    @FormField('Cantidad', [0])
    Cantidad = null;
    @FormField('Unidad', [''])
    Unidad = null;
    Unidad_Unidad: Unidad;
    @FormField('Utilidad', [''])
    Utilidad = null;
    Utilidad_Utilidad: Utilidad;
    @FormField('Condicion', [''])
    Condicion = null;
    Condicion_Tipo_de_Condicion_Parte: Tipo_de_Condicion_Parte;
    @FormField('Motivo_de_Incumplimiento', [''])
    Motivo_de_Incumplimiento = '';

     @FormField('Detalle_Partes_CMP_Cotizars', [''])
     Detalle_Partes_CMP_Cotizars: Detalle_Partes_CMP_Cotizar[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

