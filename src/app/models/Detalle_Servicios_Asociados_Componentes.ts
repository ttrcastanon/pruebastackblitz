import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Servicios } from './Servicios';


export class Detalle_Servicios_Asociados_Componentes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    IdComponente = 0;
    @FormField('N_de_servicio', [''])
    N_de_servicio = null;
    N_de_servicio_Servicios: Servicios;
    @FormField('Descripcion', [''])
    Descripcion = null;
    Descripcion_Servicios: Servicios;

     @FormField('Detalle_Servicios_Asociados_Componentess', [''])
     Detalle_Servicios_Asociados_Componentess: Detalle_Servicios_Asociados_Componentes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

