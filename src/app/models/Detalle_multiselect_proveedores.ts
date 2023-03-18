import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';


export class Detalle_multiselect_proveedores  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Id_selecionar_a_proveedor = 0;
    @FormField('Proveedor', [''])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;

     @FormField('Detalle_multiselect_proveedoress', [''])
     Detalle_multiselect_proveedoress: Detalle_multiselect_proveedores[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

