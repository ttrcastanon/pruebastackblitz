import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Detalle_de_Reportes_Prestablecidos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    id_orden_de_trabajo = 0;
    @FormField('Seleccionar', [false])
    Seleccionar = false;
    @FormField('Reporte_de_inspeccion_de_entrada', [''])
    Reporte_de_inspeccion_de_entrada = '';
    @FormField('Tipo_de_reporte', [''])
    Tipo_de_reporte = '';
    @FormField('Prioridad', [''])
    Prioridad = '';
    @FormField('Tipo_de_Codigo', [''])
    Tipo_de_Codigo = '';
    @FormField('Codigo_NP', [''])
    Codigo_NP = '';
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Detalle_de_Reportes_Prestablecidoss', [''])
     Detalle_de_Reportes_Prestablecidoss: Detalle_de_Reportes_Prestablecidos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

