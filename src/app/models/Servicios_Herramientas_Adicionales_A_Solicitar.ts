import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Servicios_Herramientas_Adicionales_A_Solicitar  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    IdCrearReporte = 0;
    @FormField('Codigo_del_servicio', [''])
    Codigo_del_servicio = '';
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Servicios_Herramientas_Adicionales_A_Solicitars', [''])
     Servicios_Herramientas_Adicionales_A_Solicitars: Servicios_Herramientas_Adicionales_A_Solicitar[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

