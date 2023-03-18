import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_FBO  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    Aeropuerto_Id = 0;
    @FormField('Nombre', [''])
    Nombre = '';
    @FormField('Telefono_Local', [''])
    Telefono_Local = '';
    @FormField('Telefono_Gratuito', [''])
    Telefono_Gratuito = '';
    @FormField('Sitio_Web', [''])
    Sitio_Web = '';

     @FormField('Detalle_FBOs', [''])
     Detalle_FBOs: Detalle_FBO[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

