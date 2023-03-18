import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Solicitud_de_Vuelo } from './Solicitud_de_Vuelo';
import { Spartan_User } from './Spartan_User';
import { Cliente } from './Cliente';
import { Estatus_autorizacion_de_prefactura } from './Estatus_autorizacion_de_prefactura';


export class Autorizacion_de_Prefactura_Aerovics  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No_prefactura', [0])
    No_prefactura = null;
    @FormField('Vuelo', [''])
    Vuelo = null;
    Vuelo_Solicitud_de_Vuelo: Solicitud_de_Vuelo;
    @FormField('Pax_Solicitante', [''])
    Pax_Solicitante = null;
    Pax_Solicitante_Spartan_User: Spartan_User;
    @FormField('Empresa_Solicitante', [''])
    Empresa_Solicitante = null;
    Empresa_Solicitante_Cliente: Cliente;
    @FormField('Fecha_de_Salida', [''])
    Fecha_de_Salida = '';
    @FormField('Fecha_de_Regreso', [''])
    Fecha_de_Regreso = '';
    @FormField('Monto_de_Factura', [''])
    Monto_de_Factura = null;
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_autorizacion_de_prefactura: Estatus_autorizacion_de_prefactura;
    @FormField('Motivo_de_rechazo_general', [''])
    Motivo_de_rechazo_general = '';
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Fecha_de_autorizacion_adm', [''])
    Fecha_de_autorizacion_adm = '';
    @FormField('Hora_de_autorizacion_adm', [''])
    Hora_de_autorizacion_adm = '';
    @FormField('Usuario_que_autoriza_adm', [''])
    Usuario_que_autoriza_adm = null;
    Usuario_que_autoriza_adm_Spartan_User: Spartan_User;
    @FormField('Resultado_de_autorizacion_adm', [''])
    Resultado_de_autorizacion_adm = null;
    Resultado_de_autorizacion_adm_Estatus_autorizacion_de_prefactura: Estatus_autorizacion_de_prefactura;
    @FormField('Motivo_de_rechazo_adm', [''])
    Motivo_de_rechazo_adm = '';
    @FormField('Observaciones_adm', [''])
    Observaciones_adm = '';
    @FormField('Fecha_de_autorizacion_dg', [''])
    Fecha_de_autorizacion_dg = '';
    @FormField('Hora_de_autorizacion_dg', [''])
    Hora_de_autorizacion_dg = '';
    @FormField('Usuario_que_autoriza_dg', [''])
    Usuario_que_autoriza_dg = null;
    Usuario_que_autoriza_dg_Spartan_User: Spartan_User;
    @FormField('Resultado_de_autorizacion_dg', [''])
    Resultado_de_autorizacion_dg = null;
    Resultado_de_autorizacion_dg_Estatus_autorizacion_de_prefactura: Estatus_autorizacion_de_prefactura;
    @FormField('Motivo_de_rechazo_dg', [''])
    Motivo_de_rechazo_dg = '';
    @FormField('Observaciones_dg', [''])
    Observaciones_dg = '';
    @FormField('Fecha_de_autorizacion_dc', [''])
    Fecha_de_autorizacion_dc = '';
    @FormField('Hora_de_autorizacion_dc', [''])
    Hora_de_autorizacion_dc = '';
    @FormField('Usuario_que_autoriza_dc', [''])
    Usuario_que_autoriza_dc = null;
    Usuario_que_autoriza_dc_Spartan_User: Spartan_User;
    @FormField('Resultado_de_autorizacion_dc', [''])
    Resultado_de_autorizacion_dc = null;
    Resultado_de_autorizacion_dc_Estatus_autorizacion_de_prefactura: Estatus_autorizacion_de_prefactura;
    @FormField('Motivo_de_rechazo_dc', [''])
    Motivo_de_rechazo_dc = '';
    @FormField('Observaciones_dc', [''])
    Observaciones_dc = '';

     @FormField('Autorizacion_de_Prefactura_Aerovicss', [''])
     Autorizacion_de_Prefactura_Aerovicss: Autorizacion_de_Prefactura_Aerovics[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

