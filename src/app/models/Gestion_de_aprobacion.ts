import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Crear_Reporte } from './Crear_Reporte';
import { Departamento } from './Departamento';
import { Spartan_User } from './Spartan_User';
import { Detalle_de_Gestion_de_aprobacion } from './Detalle_de_Gestion_de_aprobacion';


export class Gestion_de_aprobacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('No__Reporte', [''])
    No__Reporte = null;
    No__Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('No__Parte', [''])
    No__Parte = '';
    @FormField('Departamento', [''])
    Departamento = null;
    Departamento_Departamento: Departamento;
    @FormField('Solicitante', [''])
    Solicitante = null;
    Solicitante_Spartan_User: Spartan_User;
    @FormField('Detalle_de_Gestion_de_aprobacionItems', [], Detalle_de_Gestion_de_aprobacion,  true)
    Detalle_de_Gestion_de_aprobacionItems: FormArray;


     @FormField('Gestion_de_aprobacions', [''])
     Gestion_de_aprobacions: Gestion_de_aprobacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

