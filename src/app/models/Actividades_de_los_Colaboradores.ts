import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Creacion_de_Usuarios } from './Creacion_de_Usuarios';
import { Cargos } from './Cargos';
import { Cliente } from './Cliente';


export class Actividades_de_los_Colaboradores  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
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
    @FormField('Fecha_de_Reporte', [''])
    Fecha_de_Reporte = '';
    @FormField('Horas_Registradas', [''])
    Horas_Registradas = null;
    @FormField('Horas_Faltantes', [''])
    Horas_Faltantes = null;
    @FormField('Horas_Extras', [''])
    Horas_Extras = null;
    @FormField('Dia_Inhabil', [false])
    Dia_Inhabil = false;
    @FormField('No_Actividad', [''])
    No_Actividad = '';

     @FormField('Actividades_de_los_Colaboradoress', [''])
     Actividades_de_los_Colaboradoress: Actividades_de_los_Colaboradores[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

