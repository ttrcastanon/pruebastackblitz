import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Transportacion } from './Tipo_de_Transportacion';
import { Estatus_de_Confirmacion } from './Estatus_de_Confirmacion';


export class Detalle_Coord_Paxs_Transportacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Coordinacion_Pasajeros = 0;
    @FormField('Transportacion', [''])
    Transportacion = null;
    Transportacion_Tipo_de_Transportacion: Tipo_de_Transportacion;
    @FormField('Especificaciones', [''])
    Especificaciones = '';
    @FormField('Proveedor', [''])
    Proveedor = '';
    @FormField('Telefono', [''])
    Telefono = '';
    @FormField('Matricula', [''])
    Matricula = '';
    @FormField('Conductor_Piloto', [''])
    Conductor_Piloto = '';
    @FormField('Confirmado_por_Correo', [false])
    Confirmado_por_Correo = false;
    @FormField('Confirmado_por_Telefono', [false])
    Confirmado_por_Telefono = false;
    @FormField('Confirmado', [''])
    Confirmado = null;
    Confirmado_Estatus_de_Confirmacion: Estatus_de_Confirmacion;

     @FormField('Detalle_Coord_Paxs_Transportacions', [''])
     Detalle_Coord_Paxs_Transportacions: Detalle_Coord_Paxs_Transportacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

