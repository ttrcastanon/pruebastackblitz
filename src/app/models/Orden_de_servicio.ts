import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Orden_de_Trabajo } from './Orden_de_Trabajo';
import { Modelos } from './Modelos';
import { Aeronave } from './Aeronave';
import { Propietarios } from './Propietarios';
import { Estatus_Reporte } from './Estatus_Reporte';
import { Detalle_de_reportes_por_componentes } from './Detalle_de_reportes_por_componentes';
import { Detalle_de_reportes_por_aeronave } from './Detalle_de_reportes_por_aeronave';


export class Orden_de_servicio  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Folio_OS', [''])
    Folio_OS = '';
    @FormField('Numero_de_OT', [''])
    Numero_de_OT = null;
    Numero_de_OT_Orden_de_Trabajo: Orden_de_Trabajo;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Propietario', [''])
    Propietario = null;
    Propietario_Propietarios: Propietarios;
    @FormField('Fecha_de_apertura', [''])
    Fecha_de_apertura = '';
    @FormField('Fecha_de_cierre', [''])
    Fecha_de_cierre = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_Reporte: Estatus_Reporte;
    @FormField('Detalle_de_reportes_por_componentesItems', [], Detalle_de_reportes_por_componentes,  true)
    Detalle_de_reportes_por_componentesItems: FormArray;

    @FormField('Detalle_de_reportes_por_aeronaveItems', [], Detalle_de_reportes_por_aeronave,  true)
    Detalle_de_reportes_por_aeronaveItems: FormArray;


     @FormField('Orden_de_servicios', [''])
     Orden_de_servicios: Orden_de_servicio[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

