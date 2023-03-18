import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Orden_de_Trabajo } from './Tipo_de_Orden_de_Trabajo';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Propietarios } from './Propietarios';
import { Estatus_Reporte } from './Estatus_Reporte';
import { Detalle_de_Reportes_Prestablecidos } from './Detalle_de_Reportes_Prestablecidos';
import { Detalles_de_trabajo_de_OT } from './Detalles_de_trabajo_de_OT';


export class Orden_de_Trabajo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Tipo_de_orden', [''])
    Tipo_de_orden = null;
    Tipo_de_orden_Tipo_de_Orden_de_Trabajo: Tipo_de_Orden_de_Trabajo;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Propietario', [''])
    Propietario = null;
    Propietario_Propietarios: Propietarios;
    @FormField('Fecha_de_Creacion', [''])
    Fecha_de_Creacion = '';
    @FormField('Fecha_de_entrega', [''])
    Fecha_de_entrega = '';
    @FormField('Cant_de_reportes_pendientes', [0])
    Cant_de_reportes_pendientes = null;
    @FormField('Cant_de_reportes_asignados', [0])
    Cant_de_reportes_asignados = null;
    @FormField('Cant_de_reportes_cerrados', [0])
    Cant_de_reportes_cerrados = null;
    @FormField('Cant_de_rpts_mandatorios_abiertos', [0])
    Cant_de_rpts_mandatorios_abiertos = null;
    @FormField('Horas_acumuladas', [0])
    Horas_acumuladas = null;
    @FormField('Ciclos_acumulados', [0])
    Ciclos_acumulados = null;
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_Reporte: Estatus_Reporte;
    @FormField('Causa_de_Cancelacion', [''])
    Causa_de_Cancelacion = '';
    @FormField('numero_de_orden', [''])
    numero_de_orden = '';
    @FormField('Detalle_de_Reportes_PrestablecidosItems', [], Detalle_de_Reportes_Prestablecidos,  true)
    Detalle_de_Reportes_PrestablecidosItems: FormArray;

    @FormField('Detalles_de_trabajo_de_OTItems', [], Detalles_de_trabajo_de_OT,  true)
    Detalles_de_trabajo_de_OTItems: FormArray;


     @FormField('Orden_de_Trabajos', [''])
     Orden_de_Trabajos: Orden_de_Trabajo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

