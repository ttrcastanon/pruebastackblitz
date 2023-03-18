import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Tipo_Incidencia_Vuelos } from './Tipo_Incidencia_Vuelos';
import { Responsable_Incidencia_Vuelo } from './Responsable_Incidencia_Vuelo';


export class Layout_Incidencia_Vuelos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Folio_de_carga_manual', [0])
    Folio_de_carga_manual = null;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('Vuelo', [''])
    Vuelo = null;
    Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('TipoIncidencia', [''])
    TipoIncidencia = null;
    TipoIncidencia_Tipo_Incidencia_Vuelos: Tipo_Incidencia_Vuelos;
    @FormField('Responsable', [''])
    Responsable = null;
    Responsable_Responsable_Incidencia_Vuelo: Responsable_Incidencia_Vuelo;
    @FormField('Motivo', [''])
    Motivo = '';

     @FormField('Layout_Incidencia_Vueloss', [''])
     Layout_Incidencia_Vueloss: Layout_Incidencia_Vuelos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

