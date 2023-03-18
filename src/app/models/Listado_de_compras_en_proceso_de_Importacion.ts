import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Generacion_de_Orden_de_Compras } from './Generacion_de_Orden_de_Compras';
import { Detalle_de_Compras_de_Importacion } from './Detalle_de_Compras_de_Importacion';


export class Listado_de_compras_en_proceso_de_Importacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('No__Orden_de_Compra', [''])
    No__Orden_de_Compra = null;
    No__Orden_de_Compra_Generacion_de_Orden_de_Compras: Generacion_de_Orden_de_Compras;
    @FormField('Fecha_de_Factura', [''])
    Fecha_de_Factura = '';
    @FormField('Detalle_de_Compras_de_ImportacionItems', [], Detalle_de_Compras_de_Importacion,  true)
    Detalle_de_Compras_de_ImportacionItems: FormArray;


     @FormField('Listado_de_compras_en_proceso_de_Importacions', [''])
     Listado_de_compras_en_proceso_de_Importacions: Listado_de_compras_en_proceso_de_Importacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

