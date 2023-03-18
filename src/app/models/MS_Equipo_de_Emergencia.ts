import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Equipo_de_Emergencia } from './Tipo_de_Equipo_de_Emergencia';


export class MS_Equipo_de_Emergencia  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    Matricula = '';
    @FormField('Equipo_de_Emergencia', [''])
    Equipo_de_Emergencia = null;
    Equipo_de_Emergencia_Tipo_de_Equipo_de_Emergencia: Tipo_de_Equipo_de_Emergencia;

     @FormField('MS_Equipo_de_Emergencias', [''])
     MS_Equipo_de_Emergencias: MS_Equipo_de_Emergencia[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

