import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Items } from './Items';
import { Codigo_Computarizado } from './Codigo_Computarizado';
import { Catalogo_codigo_ATA } from './Catalogo_codigo_ATA';
import { Spartan_User } from './Spartan_User';


export class Discrepancias_Pendientes_Salida  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Item', [''])
    Item = null;
    Item_Items: Items;
    @FormField('Id_Reporte', [0])
    Id_Reporte = null;
    @FormField('Codigo_Computarizado', [''])
    Codigo_Computarizado = null;
    Codigo_Computarizado_Codigo_Computarizado: Codigo_Computarizado;
    @FormField('Codigo_ATA', [''])
    Codigo_ATA = null;
    Codigo_ATA_Catalogo_codigo_ATA: Catalogo_codigo_ATA;
    @FormField('Respuesta', [''])
    Respuesta = '';
    @FormField('Asignado_a', [''])
    Asignado_a = null;
    Asignado_a_Spartan_User: Spartan_User;

     @FormField('Discrepancias_Pendientes_Salidas', [''])
     Discrepancias_Pendientes_Salidas: Discrepancias_Pendientes_Salida[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

