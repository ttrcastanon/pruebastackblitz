import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_Ejecucion_Vuelo_Componentes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Ejecucion_de_Vuelo = 0;
    @FormField('Componente', [''])
    Componente = '';
    @FormField('turm', [''])
    turm = '';
    @FormField('tt', [''])
    tt = '';
    @FormField('CICLOS', [''])
    CICLOS = '';

     @FormField('Detalle_Ejecucion_Vuelo_Componentess', [''])
     Detalle_Ejecucion_Vuelo_Componentess: Detalle_Ejecucion_Vuelo_Componentes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

