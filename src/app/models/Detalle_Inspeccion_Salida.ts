import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Items } from './Items';


export class Detalle_Inspeccion_Salida  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Id_Inspeccion = 0;
    @FormField('Item', [''])
    Item = null;
    Item_Items: Items;
    @FormField('Reporte', [''])
    Reporte = '';
    @FormField('Codigo_Computarizado', [''])
    Codigo_Computarizado = '';
    @FormField('Codigo_ATA', [''])
    Codigo_ATA = '';
    @FormField('Respuesta', [''])
    Respuesta = '';
    @FormField('Asignado_a', [''])
    Asignado_a = '';

     @FormField('Detalle_Inspeccion_Salidas', [''])
     Detalle_Inspeccion_Salidas: Detalle_Inspeccion_Salida[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;

     Id_Inspeccion_Formato_de_salida_de_aeronave: number;
     ItemDescripcion: string;
}

