import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';


export class Layout_Presupuestos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Folio_carga_manual', [0])
    Folio_carga_manual = null;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Horas', [0])
    Horas = null;

     @FormField('Layout_Presupuestoss', [''])
     Layout_Presupuestoss: Layout_Presupuestos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

