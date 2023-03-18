import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Cargo_de_Tripulante } from './Cargo_de_Tripulante';
import { Tripulacion } from './Tripulacion';


export class Detalle_Registro_Vuelo_Tripulacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Registro_de_Vuelo = 0;
    @FormField('Cargo', [''])
    Cargo = null;
    Cargo_Cargo_de_Tripulante: Cargo_de_Tripulante;
    @FormField('Tripulante', [''])
    Tripulante = null;
    Tripulante_Tripulacion: Tripulacion;
    @FormField('Vencimiento_Pasaporte', [''])
    Vencimiento_Pasaporte = '';
    @FormField('Vencimiento_Licencia', [''])
    Vencimiento_Licencia = '';
    @FormField('Vencimiento_Certificado_Medico', [''])
    Vencimiento_Certificado_Medico = '';

     @FormField('Detalle_Registro_Vuelo_Tripulacions', [''])
     Detalle_Registro_Vuelo_Tripulacions: Detalle_Registro_Vuelo_Tripulacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

