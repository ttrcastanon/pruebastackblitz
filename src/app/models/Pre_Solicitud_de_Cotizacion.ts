import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_cotizacion } from './Solicitud_de_cotizacion';


export class Pre_Solicitud_de_Cotizacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Folio_Solicitud_Cotizacion', [''])
    Folio_Solicitud_Cotizacion = null;
    Folio_Solicitud_Cotizacion_Solicitud_de_cotizacion: Solicitud_de_cotizacion;
    @FormField('Folio_Proveedor', [0])
    Folio_Proveedor = null;

     @FormField('Pre_Solicitud_de_Cotizacions', [''])
     Pre_Solicitud_de_Cotizacions: Pre_Solicitud_de_Cotizacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

