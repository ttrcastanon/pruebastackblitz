import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Generacion_de_Orden_de_Compras } from './Generacion_de_Orden_de_Compras';
import { Estatus_de_Seguimiento } from './Estatus_de_Seguimiento';
import { Detalle_de_Listado_de_Pago_de_Proveedores } from './Detalle_de_Listado_de_Pago_de_Proveedores';


export class Listado_de_Pago_de_Proveedores  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('No__de_OC', [''])
    No__de_OC = null;
    No__de_OC_Generacion_de_Orden_de_Compras: Generacion_de_Orden_de_Compras;
    @FormField('Fecha_Requerida', [''])
    Fecha_Requerida = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Seguimiento: Estatus_de_Seguimiento;
    @FormField('Detalle_de_Listado_de_Pago_de_ProveedoresItems', [], Detalle_de_Listado_de_Pago_de_Proveedores,  true)
    Detalle_de_Listado_de_Pago_de_ProveedoresItems: FormArray;


     @FormField('Listado_de_Pago_de_Proveedoress', [''])
     Listado_de_Pago_de_Proveedoress: Listado_de_Pago_de_Proveedores[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

