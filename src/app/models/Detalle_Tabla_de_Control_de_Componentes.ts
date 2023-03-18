import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Codigo_Computarizado } from './Codigo_Computarizado';


export class Detalle_Tabla_de_Control_de_Componentes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Codigo_Computarizado', [''])
    Codigo_Computarizado = null;
    Codigo_Computarizado_Codigo_Computarizado: Codigo_Computarizado;
    @FormField('Descripcion', [''])
    Descripcion = null;
    Descripcion_Codigo_Computarizado: Codigo_Computarizado;
    @FormField('No_Parte', [''])
    No_Parte = '';
    @FormField('Posicion', [''])
    Posicion = '';
    @FormField('No_Serie', [''])
    No_Serie = '';
    @FormField('Horas_Acumuladas_Parte', [''])
    Horas_Acumuladas_Parte = '';
    @FormField('Ciclos_Acumulados_Parte', [''])
    Ciclos_Acumulados_Parte = '';
    @FormField('Horas_Acumuladas_Aeronave', [''])
    Horas_Acumuladas_Aeronave = '';
    @FormField('Ciclos_Acumulados_Aeronave', [''])
    Ciclos_Acumulados_Aeronave = '';

     @FormField('Detalle_Tabla_de_Control_de_Componentess', [''])
     Detalle_Tabla_de_Control_de_Componentess: Detalle_Tabla_de_Control_de_Componentes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

