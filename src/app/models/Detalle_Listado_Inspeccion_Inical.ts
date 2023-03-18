import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Cliente } from './Cliente';
import { Codigo_Computarizado } from './Codigo_Computarizado';


export class Detalle_Listado_Inspeccion_Inical  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Folio_Listado_Inspeccion_Inicial = 0;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Cliente', [''])
    Cliente = null;
    Cliente_Cliente: Cliente;
    @FormField('Fecha_Inspeccion', [''])
    Fecha_Inspeccion = '';
    @FormField('No_Serie', [''])
    No_Serie = '';
    @FormField('Codigo_Computarizado', [''])
    Codigo_Computarizado = null;
    Codigo_Computarizado_Codigo_Computarizado: Codigo_Computarizado;
    @FormField('Descripcion', [''])
    Descripcion = null;
    Descripcion_Codigo_Computarizado: Codigo_Computarizado;

     @FormField('Detalle_Listado_Inspeccion_Inicals', [''])
     Detalle_Listado_Inspeccion_Inicals: Detalle_Listado_Inspeccion_Inical[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

