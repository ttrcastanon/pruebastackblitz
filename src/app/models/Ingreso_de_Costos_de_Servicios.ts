import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Ingreso_de_Costos_de_Servicios  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Costo_', [''])
    Costo_ = null;
    @FormField('No__de_Factura', [''])
    No__de_Factura = '';
    @FormField('Fecha_de_Factura', [''])
    Fecha_de_Factura = '';
    @FormField('FolioIngresoCostosServ', [''])
    FolioIngresoCostosServ = '';

     @FormField('Ingreso_de_Costos_de_Servicioss', [''])
     Ingreso_de_Costos_de_Servicioss: Ingreso_de_Costos_de_Servicios[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

