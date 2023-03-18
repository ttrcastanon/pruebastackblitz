import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales } from './Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Spartan_User } from './Spartan_User';


export class Comparativo_de_Proveedores_Servicios  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Folio_MR_Servicios', [''])
    Folio_MR_Servicios = null;
    Folio_MR_Servicios_Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales: Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales;
    @FormField('Folio_MR_Fila_Servicios', [''])
    Folio_MR_Fila_Servicios = null;
    Folio_MR_Fila_Servicios_Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales: Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales;
    @FormField('No__de_Parte', [0])
    No__de_Parte = null;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Numero_de_Reporte', [0])
    Numero_de_Reporte = null;
    @FormField('Numero_de_O_T', [0])
    Numero_de_O_T = null;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Fecha_Estimada_del_Mtto', [''])
    Fecha_Estimada_del_Mtto = '';
    @FormField('No__Solicitud', [0])
    No__Solicitud = null;
    @FormField('Solicitante', [''])
    Solicitante = null;
    Solicitante_Spartan_User: Spartan_User;
    @FormField('Fecha_de_Solicitud', [''])
    Fecha_de_Solicitud = '';
    @FormField('Estatus', [''])
    Estatus = '';

     @FormField('Comparativo_de_Proveedores_Servicioss', [''])
     Comparativo_de_Proveedores_Servicioss: Comparativo_de_Proveedores_Servicios[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

