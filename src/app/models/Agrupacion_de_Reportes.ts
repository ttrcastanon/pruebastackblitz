import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Modulos_reportes } from './Modulos_reportes';
import { Detalle_Agrupacion_de_Reportes } from './Detalle_Agrupacion_de_Reportes';


export class Agrupacion_de_Reportes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Modulo', [''])
    Modulo = null;
    Modulo_Modulos_reportes: Modulos_reportes;
    @FormField('Detalle_Agrupacion_de_ReportesItems', [], Detalle_Agrupacion_de_Reportes,  true)
    Detalle_Agrupacion_de_ReportesItems: FormArray;


     @FormField('Agrupacion_de_Reportess', [''])
     Agrupacion_de_Reportess: Agrupacion_de_Reportes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

