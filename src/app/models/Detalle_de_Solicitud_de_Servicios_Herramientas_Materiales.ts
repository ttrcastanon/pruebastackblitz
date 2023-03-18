import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Spartan_User } from './Spartan_User';


export class Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Seguimiento_de_Solicitud_de_Compras = 0;
    @FormField('No_de_Parte', [0])
    No_de_Parte = null;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Numero_de_Reporte', [0])
    Numero_de_Reporte = null;
    @FormField('Numero_de_O_T', [0])
    Numero_de_O_T = null;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Cantidad', [0])
    Cantidad = null;
    @FormField('Unidad', [0])
    Unidad = null;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Fecha_Estimada_del_Mtto', [''])
    Fecha_Estimada_del_Mtto = '';
    @FormField('No_Solicitud', [0])
    No_Solicitud = null;
    @FormField('Solicitante', [''])
    Solicitante = null;
    Solicitante_Spartan_User: Spartan_User;
    @FormField('Fecha_de_Solicitud', [''])
    Fecha_de_Solicitud = '';
    @FormField('Estatus', [''])
    Estatus = '';
    @FormField('Cotizar', [false])
    Cotizar = false;
    @FormField('Folio_MR_Solicitud_de_Servicios', [''])
    Folio_MR_Solicitud_de_Servicios = '';
    @FormField('Folio_MR_fila_Solicitud_de_Servicios', [''])
    Folio_MR_fila_Solicitud_de_Servicios = '';

     @FormField('Detalle_de_Solicitud_de_Servicios_Herramientas_Materialess', [''])
     Detalle_de_Solicitud_de_Servicios_Herramientas_Materialess: Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

