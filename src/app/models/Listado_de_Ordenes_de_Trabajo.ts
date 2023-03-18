import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Detalle_de_Listado_de_Ordenes_de_Trabajo } from './Detalle_de_Listado_de_Ordenes_de_Trabajo';


export class Listado_de_Ordenes_de_Trabajo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Fecha_de_Vencimiento', [''])
    Fecha_de_Vencimiento = '';
    @FormField('Detalle_de_Listado_de_Ordenes_de_TrabajoItems', [], Detalle_de_Listado_de_Ordenes_de_Trabajo,  true)
    Detalle_de_Listado_de_Ordenes_de_TrabajoItems: FormArray;

    @FormField('Estatus', [''])
    Estatus = '';

     @FormField('Listado_de_Ordenes_de_Trabajos', [''])
     Listado_de_Ordenes_de_Trabajos: Listado_de_Ordenes_de_Trabajo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

