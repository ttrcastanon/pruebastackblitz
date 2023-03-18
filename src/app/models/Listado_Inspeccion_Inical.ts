import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Cliente } from './Cliente';
import { Detalle_Listado_Inspeccion_Inical } from './Detalle_Listado_Inspeccion_Inical';


export class Listado_Inspeccion_Inical  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Cliente', [''])
    Cliente = null;
    Cliente_Cliente: Cliente;
    @FormField('Fecha_Estimada_de_Entrega', [''])
    Fecha_Estimada_de_Entrega = '';
    @FormField('Detalle_Listado_Inspeccion_InicalItems', [], Detalle_Listado_Inspeccion_Inical,  true)
    Detalle_Listado_Inspeccion_InicalItems: FormArray;


     @FormField('Listado_Inspeccion_Inicals', [''])
     Listado_Inspeccion_Inicals: Listado_Inspeccion_Inical[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

