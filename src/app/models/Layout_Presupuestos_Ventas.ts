import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Layout_Presupuestos_Ventas  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Folio_de_carga_manual', [0])
    Folio_de_carga_manual = null;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('PresupuestoVentas', [''])
    PresupuestoVentas = null;

     @FormField('Layout_Presupuestos_Ventass', [''])
     Layout_Presupuestos_Ventass: Layout_Presupuestos_Ventas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

