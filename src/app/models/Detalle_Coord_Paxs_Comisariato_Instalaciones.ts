import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Instalacion } from './Tipo_de_Instalacion';
import { Estatus_de_Confirmacion } from './Estatus_de_Confirmacion';


export class Detalle_Coord_Paxs_Comisariato_Instalaciones  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Coordinacion_Pasajeros = 0;
    @FormField('Instalacion', [''])
    Instalacion = null;
    Instalacion_Tipo_de_Instalacion: Tipo_de_Instalacion;
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('No_Aplica', [false])
    No_Aplica = false;
    @FormField('Confirmado', [''])
    Confirmado = null;
    Confirmado_Estatus_de_Confirmacion: Estatus_de_Confirmacion;

     @FormField('Detalle_Coord_Paxs_Comisariato_Instalacioness', [''])
     Detalle_Coord_Paxs_Comisariato_Instalacioness: Detalle_Coord_Paxs_Comisariato_Instalaciones[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

