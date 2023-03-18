import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Equipo_de_Supervivencia } from './Tipo_de_Equipo_de_Supervivencia';


export class MS_Equipo_de_Supervivencia  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    Matricula = '';
    @FormField('Equipo_de_Supervivencia', [''])
    Equipo_de_Supervivencia = null;
    Equipo_de_Supervivencia_Tipo_de_Equipo_de_Supervivencia: Tipo_de_Equipo_de_Supervivencia;

     @FormField('MS_Equipo_de_Supervivencias', [''])
     MS_Equipo_de_Supervivencias: MS_Equipo_de_Supervivencia[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

