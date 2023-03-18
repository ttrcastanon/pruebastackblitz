import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Generacion_de_Orden_de_Compras } from './Generacion_de_Orden_de_Compras';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Categoria_de_Partes } from './Categoria_de_Partes';
import { Estatus_de_Seguimiento_de_Materiales } from './Estatus_de_Seguimiento_de_Materiales';
import { Departamento } from './Departamento';
import { Costos_de_Importacion } from './Costos_de_Importacion';
import { Ingreso_a_almacen } from './Ingreso_a_almacen';
import { Notificacion_de_rechazo_al_ingreso_de_almacen } from './Notificacion_de_rechazo_al_ingreso_de_almacen';


export class Detalle_Listado_de_compras_en_proceso  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Listado_de_compras_en_proceso = 0;
    @FormField('No__de_OC', [''])
    No__de_OC = null;
    No__de_OC_Generacion_de_Orden_de_Compras: Generacion_de_Orden_de_Compras;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('No__de_Parte_Descripcion', [''])
    No__de_Parte_Descripcion = '';
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Categoria', [''])
    Categoria = null;
    Categoria_Categoria_de_Partes: Categoria_de_Partes;
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Seguimiento_de_Materiales: Estatus_de_Seguimiento_de_Materiales;
    @FormField('Fecha_de_Entrega_Estimada', [''])
    Fecha_de_Entrega_Estimada = '';
    @FormField('Departamento', [''])
    Departamento = null;
    Departamento_Departamento: Departamento;
    @FormField('IdCostosImportacion', [''])
    IdCostosImportacion = null;
    IdCostosImportacion_Costos_de_Importacion: Costos_de_Importacion;
    @FormField('IdIngresoAlmacen', [''])
    IdIngresoAlmacen = null;
    IdIngresoAlmacen_Ingreso_a_almacen: Ingreso_a_almacen;
    @FormField('IdNotificacionRechazoIA', [''])
    IdNotificacionRechazoIA = null;
    IdNotificacionRechazoIA_Notificacion_de_rechazo_al_ingreso_de_almacen: Notificacion_de_rechazo_al_ingreso_de_almacen;
    @FormField('IdDetalleGestionAprobacion', [0])
    IdDetalleGestionAprobacion = null;

     @FormField('Detalle_Listado_de_compras_en_procesos', [''])
     Detalle_Listado_de_compras_en_procesos: Detalle_Listado_de_compras_en_proceso[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

