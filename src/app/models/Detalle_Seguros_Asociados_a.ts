import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Proveedores_de_Seguros } from './Proveedores_de_Seguros';
import { Tipo_de_Seguro } from './Tipo_de_Seguro';


export class Detalle_Seguros_Asociados_a  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Proveedor_de_Seguro', ['',Validators.required])
    Proveedor_de_Seguro = null;
    Proveedor_de_Seguro_Proveedores_de_Seguros: Proveedores_de_Seguros;
    @FormField('Tipo_de_Seguro', ['',Validators.required])
    Tipo_de_Seguro = null;
    Tipo_de_Seguro_Tipo_de_Seguro: Tipo_de_Seguro;
    @FormField('Numero_de_Poliza', ['',Validators.required])
    Numero_de_Poliza = '';
    @FormField('Fecha_De_Vigencia', ['',Validators.required])
    Fecha_De_Vigencia = '';
    IdMatricula = '';

     @FormField('Detalle_Seguros_Asociados_as', [''])
     Detalle_Seguros_Asociados_as: Detalle_Seguros_Asociados_a[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

