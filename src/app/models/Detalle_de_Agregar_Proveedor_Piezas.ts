import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';


export class Detalle_de_Agregar_Proveedor_Piezas  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Comparativo_de_Proveedores = 0;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Precio', [''])
    Precio = null;
    @FormField('Tipo_de_Cambio', [''])
    Tipo_de_Cambio = null;
    @FormField('Tipo_de_Envio', [''])
    Tipo_de_Envio = '';
    @FormField('Fecha_de_Entrega', [''])
    Fecha_de_Entrega = '';
    @FormField('Visualizacion', [''])
    Visualizacion = null;
    @FormField('VisualizacionFile', [''])
    VisualizacionFile: FileInput = null;
    @FormField('Seleccion_de_Proveedor', [false])
    Seleccion_de_Proveedor = false;

     @FormField('Detalle_de_Agregar_Proveedor_Piezass', [''])
     Detalle_de_Agregar_Proveedor_Piezass: Detalle_de_Agregar_Proveedor_Piezas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

