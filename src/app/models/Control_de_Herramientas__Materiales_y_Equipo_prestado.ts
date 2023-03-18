import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aplicacion__de_Prestamo } from './Aplicacion__de_Prestamo';
import { Aeronave } from './Aeronave';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Orden_de_servicio } from './Orden_de_servicio';
import { Crear_Reporte } from './Crear_Reporte';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Spartan_User } from './Spartan_User';
import { Detalle_de_Herramientas_y_Equipo_Prestado } from './Detalle_de_Herramientas_y_Equipo_Prestado';


export class Control_de_Herramientas__Materiales_y_Equipo_prestado  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Aplicacion', [''])
    Aplicacion = null;
    Aplicacion_Aplicacion__de_Prestamo: Aplicacion__de_Prestamo;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('No_O_T', [''])
    No_O_T = null;
    No_O_T_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('No_O_S', [''])
    No_O_S = null;
    No_O_S_Orden_de_servicio: Orden_de_servicio;
    @FormField('No__Reporte', [''])
    No__Reporte = null;
    No__Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('No__Vuelo', [''])
    No__Vuelo = null;
    No__Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Fecha_Salida', [''])
    Fecha_Salida = '';
    @FormField('Solicitante', [''])
    Solicitante = null;
    Solicitante_Spartan_User: Spartan_User;
    @FormField('Contrasena_del_Solicitante', [''])
    Contrasena_del_Solicitante = '';
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Detalle_de_Herramientas_y_Equipo_PrestadoItems', [], Detalle_de_Herramientas_y_Equipo_Prestado,  true)
    Detalle_de_Herramientas_y_Equipo_PrestadoItems: FormArray;


     @FormField('Control_de_Herramientas__Materiales_y_Equipo_prestados', [''])
     Control_de_Herramientas__Materiales_y_Equipo_prestados: Control_de_Herramientas__Materiales_y_Equipo_prestado[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

