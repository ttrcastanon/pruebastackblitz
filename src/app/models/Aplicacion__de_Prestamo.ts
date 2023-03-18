import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Aplicacion__de_Prestamo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Aplicacion__de_Prestamos', [''])
     Aplicacion__de_Prestamos: Aplicacion__de_Prestamo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

