import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Detalle_de_Seguros_Asociados } from './Detalle_de_Seguros_Asociados';


export class Seguros_Asociados_a_la_Aeronave  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Detalle_de_Seguros_AsociadosItems', [], Detalle_de_Seguros_Asociados,  true)
    Detalle_de_Seguros_AsociadosItems: FormArray;


     @FormField('Seguros_Asociados_a_la_Aeronaves', [''])
     Seguros_Asociados_a_la_Aeronaves: Seguros_Asociados_a_la_Aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

