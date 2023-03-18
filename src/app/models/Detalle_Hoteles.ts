import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_Hoteles  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    Aeropuerto_Id = 0;
    @FormField('Hotel', [''])
    Hotel = '';
    @FormField('Telefono_Local', [''])
    Telefono_Local = '';
    @FormField('Sitio_Web', [''])
    Sitio_Web = '';
    @FormField('Distancia_del_Aeropuerto', [''])
    Distancia_del_Aeropuerto = null;

     @FormField('Detalle_Hoteless', [''])
     Detalle_Hoteless: Detalle_Hoteles[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

