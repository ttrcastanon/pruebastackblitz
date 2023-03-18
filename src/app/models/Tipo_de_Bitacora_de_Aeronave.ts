import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Detalle_Parametros_Tipo_Bitacora_Aeronave } from './Detalle_Parametros_Tipo_Bitacora_Aeronave';
import { Detalle_Componentes_Tipo_Bitacora_Aeronave } from './Detalle_Componentes_Tipo_Bitacora_Aeronave';
import { Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave } from './Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave';


export class Tipo_de_Bitacora_de_Aeronave  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Detalle_Parametros_Tipo_Bitacora_AeronaveItems', [], Detalle_Parametros_Tipo_Bitacora_Aeronave,  true)
    Detalle_Parametros_Tipo_Bitacora_AeronaveItems: FormArray;

    @FormField('Detalle_Componentes_Tipo_Bitacora_AeronaveItems', [], Detalle_Componentes_Tipo_Bitacora_Aeronave,  true)
    Detalle_Componentes_Tipo_Bitacora_AeronaveItems: FormArray;

    @FormField('Detalle_Lectura_Altimetros_Tipo_Bitacora_AeronaveItems', [], Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave,  true)
    Detalle_Lectura_Altimetros_Tipo_Bitacora_AeronaveItems: FormArray;


     @FormField('Tipo_de_Bitacora_de_Aeronaves', [''])
     Tipo_de_Bitacora_de_Aeronaves: Tipo_de_Bitacora_de_Aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

