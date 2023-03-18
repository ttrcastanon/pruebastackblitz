import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Generacion_de_Orden_de_Compras } from './Generacion_de_Orden_de_Compras';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Departamento } from './Departamento';
import { Categoria_de_Partes } from './Categoria_de_Partes';
import { Estatus_de_Seguimiento_de_Materiales } from './Estatus_de_Seguimiento_de_Materiales';
import { Detalle_de_Solicitud_de_partes_materiales_y_herramientas } from './Detalle_de_Solicitud_de_partes_materiales_y_herramientas';


export class Solicitud_de_partes_materiales_y_herramientas  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No_de_OC', [''])
    No_de_OC = null;
    No_de_OC_Generacion_de_Orden_de_Compras: Generacion_de_Orden_de_Compras;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Departamento', [''])
    Departamento = null;
    Departamento_Departamento: Departamento;
    @FormField('Categoria', [''])
    Categoria = null;
    Categoria_Categoria_de_Partes: Categoria_de_Partes;
    @FormField('No__de_Parte___Descripcion', [''])
    No__de_Parte___Descripcion = '';
    @FormField('Fecha_de_Vencimiento', [''])
    Fecha_de_Vencimiento = '';
    @FormField('Ubicacion_almacen', [''])
    Ubicacion_almacen = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Seguimiento_de_Materiales: Estatus_de_Seguimiento_de_Materiales;
    @FormField('Detalle_de_Solicitud_de_partes_materiales_y_herramientasItems', [], Detalle_de_Solicitud_de_partes_materiales_y_herramientas,  true)
    Detalle_de_Solicitud_de_partes_materiales_y_herramientasItems: FormArray;


     @FormField('Solicitud_de_partes_materiales_y_herramientass', [''])
     Solicitud_de_partes_materiales_y_herramientass: Solicitud_de_partes_materiales_y_herramientas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

