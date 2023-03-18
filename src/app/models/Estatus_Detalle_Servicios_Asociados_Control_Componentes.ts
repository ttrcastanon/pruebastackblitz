import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Estatus_Detalle_Servicios_Asociados_Control_Componentes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Estatus_Detalle_Servicios_Asociados_Control_Componentess', [''])
     Estatus_Detalle_Servicios_Asociados_Control_Componentess: Estatus_Detalle_Servicios_Asociados_Control_Componentes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

