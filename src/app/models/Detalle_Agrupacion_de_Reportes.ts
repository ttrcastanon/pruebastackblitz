import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Catalogo_Reportes } from './Catalogo_Reportes';


export class Detalle_Agrupacion_de_Reportes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    IDAgrupacion = 0;
    @FormField('Reporte', [''])
    Reporte = null;
    Reporte_Catalogo_Reportes: Catalogo_Reportes;
    @FormField('Orden', [0])
    Orden = null;

     @FormField('Detalle_Agrupacion_de_Reportess', [''])
     Detalle_Agrupacion_de_Reportess: Detalle_Agrupacion_de_Reportes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

