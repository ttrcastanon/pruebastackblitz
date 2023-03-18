import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Cargo_de_Tripulante } from './Cargo_de_Tripulante';
import { Tripulacion } from './Tripulacion';


export class Detalle_Cierre_Tripulacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Cierre_de_Vuelo = 0;
    @FormField('Cargo', [''])
    Cargo = null;
    Cargo_Cargo_de_Tripulante: Cargo_de_Tripulante;
    @FormField('Tripulante', [''])
    Tripulante = null;
    Tripulante_Tripulacion: Tripulacion;

     @FormField('Detalle_Cierre_Tripulacions', [''])
     Detalle_Cierre_Tripulacions: Detalle_Cierre_Tripulacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

