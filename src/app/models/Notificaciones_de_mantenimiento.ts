import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Codigo_Computarizado } from './Codigo_Computarizado';
import { Modelos } from './Modelos';
import { Propietarios } from './Propietarios';
import { Aeronave } from './Aeronave';


export class Notificaciones_de_mantenimiento  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Codigo_computarizado', [''])
    Codigo_computarizado = null;
    Codigo_computarizado_Codigo_Computarizado: Codigo_Computarizado;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Propietario', [''])
    Propietario = null;
    Propietario_Propietarios: Propietarios;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('ATA', [''])
    ATA = '';
    @FormField('No__Bitacora', [0])
    No__Bitacora = null;
    @FormField('Fecha_de_mantenimiento', [''])
    Fecha_de_mantenimiento = '';

     @FormField('Notificaciones_de_mantenimientos', [''])
     Notificaciones_de_mantenimientos: Notificaciones_de_mantenimiento[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

