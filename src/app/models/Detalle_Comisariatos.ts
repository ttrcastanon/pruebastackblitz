import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_Comisariatos  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    Aeropuerto_Id = 0;
    @FormField('Comisariato', [''])
    Comisariato = '';
    @FormField('Telefono_Local', [''])
    Telefono_Local = '';
    @FormField('Telefono_Gratuito', [''])
    Telefono_Gratuito = '';
    @FormField('Sitio_Web', [''])
    Sitio_Web = '';

     @FormField('Detalle_Comisariatoss', [''])
     Detalle_Comisariatoss: Detalle_Comisariatos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

