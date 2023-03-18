import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';


export class Listado_de_Directivas_de_aeronavegabilidad  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Fecha_de_Creacion', [''])
    Fecha_de_Creacion = '';
    @FormField('Ingrese_N_de_Directiva_aeronavegabilidad', [''])
    Ingrese_N_de_Directiva_aeronavegabilidad = '';

     @FormField('Listado_de_Directivas_de_aeronavegabilidads', [''])
     Listado_de_Directivas_de_aeronavegabilidads: Listado_de_Directivas_de_aeronavegabilidad[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

