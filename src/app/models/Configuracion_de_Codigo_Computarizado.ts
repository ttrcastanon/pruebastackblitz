import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Codigo_Computarizado } from './Codigo_Computarizado';
import { Detalle_Config_Partes_Asociadas } from './Detalle_Config_Partes_Asociadas';
import { Detalle_Config_Servicios_Asociados } from './Detalle_Config_Servicios_Asociados';


export class Configuracion_de_Codigo_Computarizado  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Codigo_Computarizado', [''])
    Codigo_Computarizado = null;
    Codigo_Computarizado_Codigo_Computarizado: Codigo_Computarizado;
    @FormField('Detalle_Config_Partes_AsociadasItems', [], Detalle_Config_Partes_Asociadas,  true)
    Detalle_Config_Partes_AsociadasItems: FormArray;

    @FormField('Detalle_Config_Servicios_AsociadosItems', [], Detalle_Config_Servicios_Asociados,  true)
    Detalle_Config_Servicios_AsociadosItems: FormArray;


     @FormField('Configuracion_de_Codigo_Computarizados', [''])
     Configuracion_de_Codigo_Computarizados: Configuracion_de_Codigo_Computarizado[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

