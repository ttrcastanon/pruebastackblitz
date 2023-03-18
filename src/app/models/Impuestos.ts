import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Impuestos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('IVA_Nacional', [''])
    IVA_Nacional = null;
    @FormField('IVA_Internacional', [''])
    IVA_Internacional = null;
    @FormField('IVA_Frontera', [''])
    IVA_Frontera = null;
    @FormField('TUA_Nacional', [''])
    TUA_Nacional = null;
    @FormField('TUA_Internacional', [''])
    TUA_Internacional = null;
    @FormField('Cargos_por_vuelo_internacional', [''])
    Cargos_por_vuelo_internacional = null;
    @FormField('Derechos_por_servicios_migratorios', [''])
    Derechos_por_servicios_migratorios = null;
    @FormField('Fecha_ultima_modificacion', [''])
    Fecha_ultima_modificacion = '';
    @FormField('Hora_ultima_modificacion', [''])
    Hora_ultima_modificacion = '';

     @FormField('Impuestoss', [''])
     Impuestoss: Impuestos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

