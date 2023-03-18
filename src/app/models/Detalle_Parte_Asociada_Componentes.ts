import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Piezas } from './Piezas';


export class Detalle_Parte_Asociada_Componentes  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    IdComponente = 0;
    @FormField('N_de_parte', [''])
    N_de_parte = null;
    N_de_parte_Piezas: Piezas;
    @FormField('Descripcion', [''])
    Descripcion = null;
    Descripcion_Piezas: Piezas;
    @FormField('Limite_de_Meses', [0])
    Limite_de_Meses = null;
    @FormField('Limite_de_Horas', [0])
    Limite_de_Horas = null;
    @FormField('Limite_de_ciclos', [0])
    Limite_de_ciclos = null;

     @FormField('Detalle_Parte_Asociada_Componentess', [''])
     Detalle_Parte_Asociada_Componentess: Detalle_Parte_Asociada_Componentes[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

