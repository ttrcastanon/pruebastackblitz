import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Items } from './Items';
import { Condicion_del_item } from './Condicion_del_item';


export class Detalle_Inspeccion_Entrada_Aeronave  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    id_Inspeccion_Entrada_Aeronave = 0;
    @FormField('Items', [''])
    Items = null;
    Items_Items: Items;
    @FormField('Condicion_del_item', [''])
    Condicion_del_item = null;
    Condicion_del_item_Condicion_del_item: Condicion_del_item;
    @FormField('Fotografia', [''])
    Fotografia = null;
    @FormField('FotografiaFile', [''])
    FotografiaFile: FileInput = null;
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('IdReporte', [0])
    IdReporte = null;
    @FormField('Notificado', [false])
    Notificado = false;

     @FormField('Detalle_Inspeccion_Entrada_Aeronaves', [''])
     Detalle_Inspeccion_Entrada_Aeronaves: Detalle_Inspeccion_Entrada_Aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;

     Fotografia_Spartane_File: any;
     Fotografia_URL: any;
     Id: any;
     ItemsDescripcion: string;
     id_Inspeccion_Entrada_Aeronave_Inspeccion_Entrada_Aeronave: any;
}

