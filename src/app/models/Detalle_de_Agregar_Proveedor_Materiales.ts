import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Departamento } from './Departamento';


export class Detalle_de_Agregar_Proveedor_Materiales  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Comparativo_de_Proveedores_Materiales = 0;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Precio', [''])
    Precio = null;
    @FormField('Tipo_de_Cambio', [''])
    Tipo_de_Cambio = null;
    @FormField('Departamento', [''])
    Departamento = null;
    Departamento_Departamento: Departamento;
    @FormField('Tipo_de_Envio', [0])
    Tipo_de_Envio = null;
    @FormField('Fecha_de_Entrega', [''])
    Fecha_de_Entrega = '';
    @FormField('Seleccion_de_Proveedor', [false])
    Seleccion_de_Proveedor = false;

     @FormField('Detalle_de_Agregar_Proveedor_Materialess', [''])
     Detalle_de_Agregar_Proveedor_Materialess: Detalle_de_Agregar_Proveedor_Materiales[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

