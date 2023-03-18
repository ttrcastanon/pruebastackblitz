import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Horarios_de_Trabajo  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Horas_de_trabajo', [''])
    Horas_de_trabajo = null;
    @FormField('Inicio_de_hora_laboral', [''])
    Inicio_de_hora_laboral = '';
    @FormField('Fin_de_hora_laboral', [''])
    Fin_de_hora_laboral = '';

     @FormField('Horarios_de_Trabajos', [''])
     Horarios_de_Trabajos: Horarios_de_Trabajo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

