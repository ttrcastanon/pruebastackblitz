import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';
import { Departamento } from './Departamento';
import { Crear_Reporte } from './Crear_Reporte';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Detalle_de_Cuadro_Comparativo } from './Detalle_de_Cuadro_Comparativo';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';
import { Moneda } from './Moneda';
import { Estatus_de_Seguimiento } from './Estatus_de_Seguimiento';
import { Autorizacion } from './Autorizacion';


export class Comparativo_de_Proveedores_Piezas extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No__Solicitud', [0])
    No__Solicitud = null;
    @FormField('Solicitante', [''])
    Solicitante = null;
    Solicitante_Spartan_User: Spartan_User;
    @FormField('Fecha_de_Solicitud', [''])
    Fecha_de_Solicitud = '';
    @FormField('Razon_de_la_Compra', [''])
    Razon_de_la_Compra = '';
    @FormField('Departamento', [''])
    Departamento = null;
    Departamento_Departamento: Departamento;
    @FormField('Numero_de_Reporte', [''])
    Numero_de_Reporte = null;
    Numero_de_Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('Numero_de_O_T', [''])
    Numero_de_O_T = null;
    Numero_de_O_T_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Detalle_de_Cuadro_ComparativoItems', [], Detalle_de_Cuadro_Comparativo, true)
    Detalle_de_Cuadro_ComparativoItems: FormArray;

    @FormField('Estatus', [''])
    Estatus = '';

    @FormField('Proveedor1', [''])
    Proveedor1 = null;
    Proveedor1_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Total_Proveedor1', ['0.00'])
    Total_Proveedor1 = '0.00';
    @FormField('Total_Cotizacion_Proveedor1', ['0.00'])
    Total_Cotizacion_Proveedor1 = '0.00';
    @FormField('Tipo_de_Moneda1', [''])
    Tipo_de_Moneda1 = null;
    Tipo_de_Moneda1_Moneda: Moneda;

    @FormField('Proveedor2', [''])
    Proveedor2 = null;
    Proveedor2_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Total_Proveedor2', ['0.00'])
    Total_Proveedor2 = '0.00';
    @FormField('Total_Cotizacion_Proveedor2', ['0.00'])
    Total_Cotizacion_Proveedor2 = '0.00';
    @FormField('Tipo_de_Moneda2', [''])
    Tipo_de_Moneda2 = null;
    Tipo_de_Moneda2_Moneda: Moneda;

    @FormField('Proveedor3', [''])
    Proveedor3 = null;
    Proveedor3_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Total_Proveedor3', ['0.00'])
    Total_Proveedor3 = '0.00';
    @FormField('Total_Cotizacion_Proveedor3', ['0.00'])
    Total_Cotizacion_Proveedor3 = '0.00';
    @FormField('Tipo_de_Moneda3', [''])
    Tipo_de_Moneda3 = null;
    Tipo_de_Moneda3_Moneda: Moneda;

    @FormField('Proveedor4', [''])
    Proveedor4 = null;
    Proveedor4_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Total_Proveedor4', ['0.00'])
    Total_Proveedor4 = '0.00';
    @FormField('Total_Cotizacion_Proveedor4', ['0.00'])
    Total_Cotizacion_Proveedor4 = '0.00';
    @FormField('Tipo_de_Moneda4', [''])
    Tipo_de_Moneda4 = null;
    Tipo_de_Moneda4_Moneda: Moneda;

    @FormField('Total_Cotizacion', ['0.00'])
    Total_Cotizacion = null;
    @FormField('Tipo_de_Cambio', ['0.00'])
    Tipo_de_Cambio = null;
    @FormField('Tipo_de_Moneda', [''])
    Tipo_de_Moneda = null;
    Tipo_de_Moneda_Moneda: Moneda;
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Estatus_de_Seguimiento', [''])
    Estatus_de_Seguimiento = null;
    Estatus_de_Seguimiento_Estatus_de_Seguimiento: Estatus_de_Seguimiento;
    @FormField('idComprasGenerales', [0])
    idComprasGenerales = null;
    @FormField('idGestionAprobacionMantenimiento', [0])
    idGestionAprobacionMantenimiento = null;
    @FormField('FolioComparativoProv', [''])
    FolioComparativoProv = '';
    @FormField('Fecha_de_Autorizacion', [''])
    Fecha_de_Autorizacion = '';
    @FormField('Hora_de_Autorizacion', [''])
    Hora_de_Autorizacion = '';
    @FormField('Autorizado_por', [''])
    Autorizado_por = null;
    Autorizado_por_Spartan_User: Spartan_User;
    @FormField('Resultado', [''])
    Resultado = null;
    Resultado_Autorizacion: Autorizacion;
    @FormField('Motivo_de_Rechazo', [''])
    Motivo_de_Rechazo = '';
    @FormField('Fecha_de_Autorizacion_DG', [''])
    Fecha_de_Autorizacion_DG = '';
    @FormField('Hora_de_Autorizacion_DG', [''])
    Hora_de_Autorizacion_DG = '';
    @FormField('Autorizado_por_DG', [''])
    Autorizado_por_DG = null;
    Autorizado_por_DG_Spartan_User: Spartan_User;
    @FormField('Resultado_DG', [''])
    Resultado_DG = null;
    Resultado_DG_Autorizacion: Autorizacion;
    @FormField('Motivo_de_Rechazo_DG', [''])
    Motivo_de_Rechazo_DG = '';
    @FormField('Fecha_de_Autorizacion_Adm', [''])
    Fecha_de_Autorizacion_Adm = '';
    @FormField('Hora_de_Autorizacion_Adm', [''])
    Hora_de_Autorizacion_Adm = '';
    @FormField('Autorizado_por_Adm', [''])
    Autorizado_por_Adm = null;
    Autorizado_por_Adm_Spartan_User: Spartan_User;
    @FormField('Resultado_Adm', [''])
    Resultado_Adm = null;
    Resultado_Adm_Autorizacion: Autorizacion;
    @FormField('Motivo_de_Rechazo_Adm', [''])
    Motivo_de_Rechazo_Adm = '';

    @FormField('Comparativo_de_Proveedores_Piezass', [''])
    Comparativo_de_Proveedores_Piezass: Comparativo_de_Proveedores_Piezas[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

