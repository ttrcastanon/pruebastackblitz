import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Creacion_de_Proveedores } from './Creacion_de_Proveedores';


export class Layout_Proveedores  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Folio_de_carga_manual', [0])
    Folio_de_carga_manual = null;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('ID_Proveedor', [''])
    ID_Proveedor = null;
    ID_Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('RFC_Proveedor', [''])
    RFC_Proveedor = null;
    RFC_Proveedor_Creacion_de_Proveedores: Creacion_de_Proveedores;
    @FormField('Descripcion_Proveedor', [''])
    Descripcion_Proveedor = '';
    @FormField('Monto', [''])
    Monto = null;

     @FormField('Layout_Proveedoress', [''])
     Layout_Proveedoress: Layout_Proveedores[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

