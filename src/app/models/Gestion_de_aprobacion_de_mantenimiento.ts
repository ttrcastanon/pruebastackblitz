import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Crear_Reporte } from './Crear_Reporte';
import { Spartan_User } from './Spartan_User';
import { Departamento } from './Departamento';
import { Detalle_Solicitud_de_Piezas } from './Detalle_Solicitud_de_Piezas';
import { Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion } from './Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion';
import { Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion } from './Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion';
import { Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion } from './Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion';
import { Estatus_Gestion_Aprobacion } from './Estatus_Gestion_Aprobacion';


export class Gestion_de_aprobacion_de_mantenimiento  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('N_Reporte', [''])
    N_Reporte = null;
    N_Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('Solicitante', [''])
    Solicitante = null;
    Solicitante_Spartan_User: Spartan_User;
    @FormField('Departamento', [''])
    Departamento = null;
    Departamento_Departamento: Departamento;
    @FormField('Fecha_de_solicitud', [''])
    Fecha_de_solicitud = '';
    @FormField('Motivo_de_Cancelacion', [''])
    Motivo_de_Cancelacion = '';
    @FormField('Detalle_Solicitud_de_PiezasItems', [], Detalle_Solicitud_de_Piezas,  true)
    Detalle_Solicitud_de_PiezasItems: FormArray;

    @FormField('Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionItems', [], Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion,  true)
    Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionItems: FormArray;

    @FormField('Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionItems', [], Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion,  true)
    Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionItems: FormArray;

    @FormField('Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionItems', [], Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion,  true)
    Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionItems: FormArray;

    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_Gestion_Aprobacion: Estatus_Gestion_Aprobacion;

     @FormField('Gestion_de_aprobacion_de_mantenimientos', [''])
     Gestion_de_aprobacion_de_mantenimientos: Gestion_de_aprobacion_de_mantenimiento[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

