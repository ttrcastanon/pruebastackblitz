import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Generacion_de_Orden_de_Compras } from './Generacion_de_Orden_de_Compras';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Departamento } from './Departamento';
import { Categoria_de_Partes } from './Categoria_de_Partes';
import { Estatus_de_Seguimiento_de_Materiales } from './Estatus_de_Seguimiento_de_Materiales';
import { Detalle_Listado_de_compras_en_proceso } from './Detalle_Listado_de_compras_en_proceso';


export class Listado_de_compras_en_proceso  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No__de_OC', [''])
    No__de_OC = null;
    No__de_OC_Generacion_de_Orden_de_Compras: Generacion_de_Orden_de_Compras;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Departamento', [''])
    Departamento = null;
    Departamento_Departamento: Departamento;
    @FormField('Categoria', [''])
    Categoria = null;
    Categoria_Categoria_de_Partes: Categoria_de_Partes;
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Seguimiento_de_Materiales: Estatus_de_Seguimiento_de_Materiales;
    @FormField('Fecha_de_Entrega_Inicial', [''])
    Fecha_de_Entrega_Inicial = '';
    @FormField('Fecha_de_Entrega_Final', [''])
    Fecha_de_Entrega_Final = '';
    @FormField('Detalle_Listado_de_compras_en_procesoItems', [], Detalle_Listado_de_compras_en_proceso,  true)
    Detalle_Listado_de_compras_en_procesoItems: FormArray;


     @FormField('Listado_de_compras_en_procesos', [''])
     Listado_de_compras_en_procesos: Listado_de_compras_en_proceso[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

