import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Politica_de_Proveedores  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Monto_AutorizadoHasta', [''])
    Monto_AutorizadoHasta = null;

     @FormField('Politica_de_Proveedoress', [''])
     Politica_de_Proveedoress: Politica_de_Proveedores[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

