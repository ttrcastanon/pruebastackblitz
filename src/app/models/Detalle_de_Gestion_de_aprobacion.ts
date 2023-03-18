import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Unidad } from './Unidad';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Urgencia } from './Urgencia';
import { Departamento } from './Departamento';
import { Propietarios } from './Propietarios';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Crear_Reporte } from './Crear_Reporte';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Spartan_User } from './Spartan_User';
import { Estatus_de_Seguimiento } from './Estatus_de_Seguimiento';
import { Comparativo_de_Proveedores_Piezas } from './Comparativo_de_Proveedores_Piezas';
import { Gestion_de_Importacion } from './Gestion_de_Importacion';
import { Gestion_de_Exportacion } from './Gestion_de_Exportacion';
import { Generacion_de_Orden_de_Compras } from './Generacion_de_Orden_de_Compras';


export class Detalle_de_Gestion_de_aprobacion extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Cantidad', [0])
    Cantidad = null;
    @FormField('Unidad', [''])
    Unidad = null;
    Unidad_Unidad: Unidad;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Urgencia', [''])
    Urgencia = null;
    Urgencia_Urgencia: Urgencia;
    @FormField('Fecha_de_Entrega', [''])
    Fecha_de_Entrega = '';
    @FormField('Departamento', [''])
    Departamento = null;
    Departamento_Departamento: Departamento;
    @FormField('Razon_de_la_Solicitud', [''])
    Razon_de_la_Solicitud = '';
    @FormField('Propietario', [''])
    Propietario = null;
    Propietario_Propietarios: Propietarios;
    @FormField('Estatus', [''])
    Estatus = '';
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('No__de_Reporte', [''])
    No__de_Reporte = null;
    No__de_Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('No__O_T', [''])
    No__O_T = null;
    No__O_T_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('Solicitante', [''])
    Solicitante = null;
    Solicitante_Spartan_User: Spartan_User;
    @FormField('No__Solicitud', [0])
    No__Solicitud = null;
    @FormField('Estatus_de_Flujo', [''])
    Estatus_de_Flujo = null;
    Estatus_de_Flujo_Estatus_de_Seguimiento: Estatus_de_Seguimiento;
    @FormField('IdComparativoProveedores', [''])
    IdComparativoProveedores = null;
    IdComparativoProveedores_Comparativo_de_Proveedores_Piezas: Comparativo_de_Proveedores_Piezas;
    @FormField('IdImportacion', [''])
    IdImportacion = null;
    IdImportacion_Gestion_de_Importacion: Gestion_de_Importacion;
    @FormField('IdExportacion', [''])
    IdExportacion = null;
    IdExportacion_Gestion_de_Exportacion: Gestion_de_Exportacion;
    @FormField('IdGeneracionOC', [''])
    IdGeneracionOC = null;
    IdGeneracionOC_Generacion_de_Orden_de_Compras: Generacion_de_Orden_de_Compras;
    @FormField('IdFolioDetalle', [0])
    IdFolioDetalle = null;
    @FormField('TipoMR', [0])
    TipoMR = null;

    Unidad_Descripcion: string = ""
    Urgencia_Descripcion: string = ""
    Departamento_Nombre: string = ""
    ModeloDescripcion: string = ""
    Solicitante_Name: string = ""

    @FormField('Generar_OC', [0])
    Generar_OC: boolean = false;

    @FormField('Detalle_de_Gestion_de_aprobacions', [''])
    Detalle_de_Gestion_de_aprobacions: Detalle_de_Gestion_de_aprobacion[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

