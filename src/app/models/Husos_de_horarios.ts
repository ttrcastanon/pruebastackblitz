import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Husos_de_horarios  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Ano', [0])
    Ano = null;
    @FormField('Fecha_inicio_horario_verano', [''])
    Fecha_inicio_horario_verano = '';
    @FormField('Fecha_fin_horario_verano', [''])
    Fecha_fin_horario_verano = '';
    @FormField('Diferencia_hora_verano', [0])
    Diferencia_hora_verano = null;
    @FormField('Fecha_inicio_horario_invierno', [''])
    Fecha_inicio_horario_invierno = '';
    @FormField('Fecha_fin_horario_invierno', [''])
    Fecha_fin_horario_invierno = '';
    @FormField('Diferencia_hora_invierno', [0])
    Diferencia_hora_invierno = null;

     @FormField('Husos_de_horarioss', [''])
     Husos_de_horarioss: Husos_de_horarios[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

