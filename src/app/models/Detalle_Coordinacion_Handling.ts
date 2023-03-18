import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeropuertos } from './Aeropuertos';
import { Estatus_de_Confirmacion } from './Estatus_de_Confirmacion';


export class Detalle_Coordinacion_Handling extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Coordinacion_Handling = 0;
    @FormField('Destino', ['', Validators.required])
    Destino = '';
    Destino_Aeropuertos: Aeropuertos;
    @FormField('Handler', ['', Validators.required])
    Handler = '';
    @FormField('No__De_Telefono', ['', Validators.required])
    No__De_Telefono = '';
    @FormField('Fecha_de_Solicitud', [''])
    Fecha_de_Solicitud = '';
    @FormField('Confirmado_por_Correo', [false])
    Confirmado_por_Correo = false;
    @FormField('Confirmado_por_Telefono', [false])
    Confirmado_por_Telefono = false;
    @FormField('Confirmado', ['', Validators.required])
    Confirmado = null;
    Confirmado_Estatus_de_Confirmacion: Estatus_de_Confirmacion;

    @FormField('Detalle_Coordinacion_Handlings', [''])
    Detalle_Coordinacion_Handlings: Detalle_Coordinacion_Handling[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

