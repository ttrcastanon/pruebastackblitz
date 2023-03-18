import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Calendario_Configuracion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Query', [''])
    Query = '';
    @FormField('imagen', [''])
    imagen = '';
    @FormField('Color', [''])
    Color = '';
    @FormField('EventoClick', [false])
    EventoClick = false;

     @FormField('Calendario_Configuracions', [''])
     Calendario_Configuracions: Calendario_Configuracion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

