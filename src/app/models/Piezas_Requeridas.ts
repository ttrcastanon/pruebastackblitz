import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Piezas_Requeridas  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    IdCrearReporte = 0;
    @FormField('No_Parte', [''])
    No_Parte = '';
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Piezas_Requeridass', [''])
     Piezas_Requeridass: Piezas_Requeridas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

