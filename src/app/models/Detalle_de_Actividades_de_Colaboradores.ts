import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Actividades_de_los_Colaboradores } from './Actividades_de_los_Colaboradores';
import { Creacion_de_Usuarios } from './Creacion_de_Usuarios';
import { Cargos } from './Cargos';
import { Cliente } from './Cliente';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Orden_de_servicio } from './Orden_de_servicio';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Crear_Reporte } from './Crear_Reporte';
import { Aeronave } from './Aeronave';
import { Catalogo_Actividades_de_Colaboradores } from './Catalogo_Actividades_de_Colaboradores';


export class Detalle_de_Actividades_de_Colaboradores  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Id_Actividad', [''])
    Id_Actividad = null;
    Id_Actividad_Actividades_de_los_Colaboradores: Actividades_de_los_Colaboradores;
    @FormField('Fecha_de_Reporte', [''])
    Fecha_de_Reporte = '';
    @FormField('Dia_Inhabil', [false])
    Dia_Inhabil = false;
    @FormField('Colaborador', [''])
    Colaborador = null;
    Colaborador_Creacion_de_Usuarios: Creacion_de_Usuarios;
    @FormField('Puesto', [''])
    Puesto = null;
    Puesto_Cargos: Cargos;
    @FormField('Empresa', [''])
    Empresa = null;
    Empresa_Cliente: Cliente;
    @FormField('Inicio_Horario_Laboral', [''])
    Inicio_Horario_Laboral = '';
    @FormField('Fin_Horario_Laboral', [''])
    Fin_Horario_Laboral = '';
    @FormField('No_OT', [''])
    No_OT = null;
    No_OT_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('No_OS', [''])
    No_OS = null;
    No_OS_Orden_de_servicio: Orden_de_servicio;
    @FormField('No_Vuelo', [''])
    No_Vuelo = null;
    No_Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('No_Reporte', [''])
    No_Reporte = null;
    No_Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('Hora_Inicial', [''])
    Hora_Inicial = '';
    @FormField('Hora_Final', [''])
    Hora_Final = '';
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Concepto', [''])
    Concepto = null;
    Concepto_Catalogo_Actividades_de_Colaboradores: Catalogo_Actividades_de_Colaboradores;
    @FormField('Hora_Normal', [''])
    Hora_Normal = null;
    @FormField('Horas_Extra', [''])
    Horas_Extra = null;
    @FormField('Tiempo_Normal', [''])
    Tiempo_Normal = '';
    @FormField('Tiempo_Extra', [''])
    Tiempo_Extra = '';
    @FormField('Aeronave_Propia', [false])
    Aeronave_Propia = false;
    @FormField('Observaciones', [''])
    Observaciones = '';

     @FormField('Detalle_de_Actividades_de_Colaboradoress', [''])
     Detalle_de_Actividades_de_Colaboradoress: Detalle_de_Actividades_de_Colaboradores[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

