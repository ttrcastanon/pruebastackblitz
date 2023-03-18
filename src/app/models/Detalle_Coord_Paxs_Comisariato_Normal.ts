import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Estatus_de_Confirmacion } from './Estatus_de_Confirmacion';


export class Detalle_Coord_Paxs_Comisariato_Normal extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Coordinacion_Pasajeros = 0;
    @FormField('Concepto', ['', Validators.required])
    Concepto = '';
    @FormField('SC', ['', Validators.required])
    SC = '';
    @FormField('Fecha', ['', Validators.required])
    Fecha = '';
    @FormField('Confirmado', [''])
    Confirmado = null;
    Confirmado_Estatus_de_Confirmacion: Estatus_de_Confirmacion;

    @FormField('Detalle_Coord_Paxs_Comisariato_Normals', [''])
    Detalle_Coord_Paxs_Comisariato_Normals: Detalle_Coord_Paxs_Comisariato_Normal[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

