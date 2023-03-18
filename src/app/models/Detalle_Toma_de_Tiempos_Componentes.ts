import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_Toma_de_Tiempos_Componentes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Toma_de_Tiempos = 0;
    @FormField('Componente', [''])
    Componente = '';
    @FormField('turm', [0])
    turm = null;
    @FormField('T_T_', [0])
    T_T_ = null;
    @FormField('CICLOS', [0])
    CICLOS = null;

     @FormField('Detalle_Toma_de_Tiempos_Componentess', [''])
     Detalle_Toma_de_Tiempos_Componentess: Detalle_Toma_de_Tiempos_Componentes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

