import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Servicios } from './Servicios';
import { Estatus_Detalle_Servicios_Asociados_Control_Componentes } from './Estatus_Detalle_Servicios_Asociados_Control_Componentes';


export class Detalle_Servicios_Asociados_Control_Componentes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    IdBoletin = 0;
    @FormField('N_de_Servicio_Descripcion', [''])
    N_de_Servicio_Descripcion = null;
    N_de_Servicio_Descripcion_Servicios: Servicios;
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_Detalle_Servicios_Asociados_Control_Componentes: Estatus_Detalle_Servicios_Asociados_Control_Componentes;

     @FormField('Detalle_Servicios_Asociados_Control_Componentess', [''])
     Detalle_Servicios_Asociados_Control_Componentess: Detalle_Servicios_Asociados_Control_Componentes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

