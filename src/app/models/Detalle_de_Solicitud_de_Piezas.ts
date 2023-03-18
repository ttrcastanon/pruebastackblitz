import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Spartan_User } from './Spartan_User';


export class Detalle_de_Solicitud_de_Piezas  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Seguimiento_de_Solicitud_de_Compras = 0;
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
    @FormField('Cantidad', [0])
    Cantidad = null;
    @FormField('Unidad', [0])
    Unidad = null;
    @FormField('Horas_del_Componente_a_remover', [0])
    Horas_del_Componente_a_remover = null;
    @FormField('Ciclos_del_componente_a_remover', [0])
    Ciclos_del_componente_a_remover = null;
    @FormField('Condicion_de_la_pieza_solicitada', [0])
    Condicion_de_la_pieza_solicitada = null;
    @FormField('Fecha_estimada_del_Mtto_', [''])
    Fecha_estimada_del_Mtto_ = '';
    @FormField('Detalle_de_la_falla', [''])
    Detalle_de_la_falla = '';
    @FormField('Ref_', [''])
    Ref_ = '';
    @FormField('No__Solicitud', [0])
    No__Solicitud = null;
    @FormField('Solicitante', [''])
    Solicitante = null;
    Solicitante_Spartan_User: Spartan_User;
    @FormField('Fecha_de_Solicitud', [''])
    Fecha_de_Solicitud = '';
    @FormField('Estatus', [''])
    Estatus = '';
    @FormField('Cotizar', [false])
    Cotizar = false;
    @FormField('Folio_MR_Solicitud_de_Piezas', [''])
    Folio_MR_Solicitud_de_Piezas = '';
    @FormField('Folio_MR_fila_Solicitud_de_Piezas', [''])
    Folio_MR_fila_Solicitud_de_Piezas = '';

     @FormField('Detalle_de_Solicitud_de_Piezass', [''])
     Detalle_de_Solicitud_de_Piezass: Detalle_de_Solicitud_de_Piezas[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

