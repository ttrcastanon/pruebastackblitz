import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';


export class detalle_de_configuracion_de_proveedores  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    Solicitud_de_cotizacion = 0;
    @FormField('Proveedor', ['',Validators.required])
    Proveedor = null;
    Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;

     @FormField('detalle_de_configuracion_de_proveedoress', [''])
     detalle_de_configuracion_de_proveedoress: detalle_de_configuracion_de_proveedores[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

