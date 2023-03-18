import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Servicios } from './Servicios';


export class Detalle_Config_Servicios_Asociados  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Configuracion = 0;
    @FormField('Codigo_de_Servicio', [''])
    Codigo_de_Servicio = null;
    Codigo_de_Servicio_Servicios: Servicios;
    @FormField('Cantidad', [0])
    Cantidad = null;

     @FormField('Detalle_Config_Servicios_Asociadoss', [''])
     Detalle_Config_Servicios_Asociadoss: Detalle_Config_Servicios_Asociados[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

