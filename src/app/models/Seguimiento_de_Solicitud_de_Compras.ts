import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Crear_Reporte } from './Crear_Reporte';
import { Partes } from './Partes';
import { Departamento } from './Departamento';
import { Spartan_User } from './Spartan_User';
import { Urgencia } from './Urgencia';
import { Detalle_de_Seguimiento_de_Solicitud_de_Compras } from './Detalle_de_Seguimiento_de_Solicitud_de_Compras';


export class Seguimiento_de_Solicitud_de_Compras  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Numero_de_Reporte', [''])
    Numero_de_Reporte = null;
    Numero_de_Reporte_Crear_Reporte: Crear_Reporte;
    @FormField('Numero_de_Parte', [''])
    Numero_de_Parte = null;
    Numero_de_Parte_Partes: Partes;
    @FormField('Departamento', [''])
    Departamento = null;
    Departamento_Departamento: Departamento;
    @FormField('Solicitante', [''])
    Solicitante = null;
    Solicitante_Spartan_User: Spartan_User;
    @FormField('Urgencia', [''])
    Urgencia = null;
    Urgencia_Urgencia: Urgencia;
    @FormField('Detalle_de_Seguimiento_de_Solicitud_de_ComprasItems', [], Detalle_de_Seguimiento_de_Solicitud_de_Compras,  true)
    Detalle_de_Seguimiento_de_Solicitud_de_ComprasItems: FormArray;


     @FormField('Seguimiento_de_Solicitud_de_Comprass', [''])
     Seguimiento_de_Solicitud_de_Comprass: Seguimiento_de_Solicitud_de_Compras[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

