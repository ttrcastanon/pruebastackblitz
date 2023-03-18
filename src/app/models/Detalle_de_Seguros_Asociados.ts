import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Proveedores_de_Seguros } from './Proveedores_de_Seguros';
import { Tipo_de_Seguro } from './Tipo_de_Seguro';


export class Detalle_de_Seguros_Asociados  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Seguros_Asociados_a_la_aeronave = 0;
    @FormField('Proveedor_de_Seguro', [''])
    Proveedor_de_Seguro = null;
    Proveedor_de_Seguro_Proveedores_de_Seguros: Proveedores_de_Seguros;
    @FormField('Tipo_de_Seguro', [''])
    Tipo_de_Seguro = null;
    Tipo_de_Seguro_Tipo_de_Seguro: Tipo_de_Seguro;
    @FormField('No__Poliza', [0])
    No__Poliza = null;
    @FormField('Fecha_de_Vigencia', [''])
    Fecha_de_Vigencia = '';

     @FormField('Detalle_de_Seguros_Asociadoss', [''])
     Detalle_de_Seguros_Asociadoss: Detalle_de_Seguros_Asociados[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

