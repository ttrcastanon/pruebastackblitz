import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Generacion_de_Orden_de_Compras } from './Generacion_de_Orden_de_Compras';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Departamento } from './Departamento';
import { Categoria_de_Partes } from './Categoria_de_Partes';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Crear_Reporte } from './Crear_Reporte';
import { Spartan_User } from './Spartan_User';
import { Estatus_de_Seguimiento_de_Materiales } from './Estatus_de_Seguimiento_de_Materiales';
import { Salida_en_Almacen_de_partes } from './Salida_en_Almacen_de_partes';
import { Salida_en_almacen } from './Salida_en_almacen';
import { Ingreso_a_almacen } from './Ingreso_a_almacen';


export class Detalle_de_Solicitud_de_partes_materiales_y_herramientas  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Partes_materiales_y_herramientas = 0;
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
    @FormField('No__de_OT', [''])
    No__de_OT = null;
    No__de_OT_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('No__Reporte', [''])
    No__Reporte = null;
    No__Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('No__de_parte__Descripcion', [''])
    No__de_parte__Descripcion = '';
    @FormField('Fecha_de_Vencimiento', [''])
    Fecha_de_Vencimiento = '';
    @FormField('Ubicacion_de_Almacen', [''])
    Ubicacion_de_Almacen = '';
    @FormField('No__de_Solicitud', [0])
    No__de_Solicitud = null;
    @FormField('Solicitante', [''])
    Solicitante = null;
    Solicitante_Spartan_User: Spartan_User;
    @FormField('Fecha_de_Solicitud', [''])
    Fecha_de_Solicitud = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_de_Seguimiento_de_Materiales: Estatus_de_Seguimiento_de_Materiales;
    @FormField('IdAsignaciondePartes', [''])
    IdAsignaciondePartes = null;
    IdAsignaciondePartes_Salida_en_Almacen_de_partes: Salida_en_Almacen_de_partes;
    @FormField('IdSalidaenAlmacen', [''])
    IdSalidaenAlmacen = null;
    IdSalidaenAlmacen_Salida_en_almacen: Salida_en_almacen;
    @FormField('IdIngresoAlmacen', [''])
    IdIngresoAlmacen = null;
    IdIngresoAlmacen_Ingreso_a_almacen: Ingreso_a_almacen;
    @FormField('IdDetalleGestionAprobacion', [0])
    IdDetalleGestionAprobacion = null;
    @FormField('Asignar_Parte', [''])
    Asignar_Parte = '';
    @FormField('Salida', [''])
    Salida = '';

     @FormField('Detalle_de_Solicitud_de_partes_materiales_y_herramientass', [''])
     Detalle_de_Solicitud_de_partes_materiales_y_herramientass: Detalle_de_Solicitud_de_partes_materiales_y_herramientas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

