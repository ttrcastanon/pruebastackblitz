import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';
import { detalle_de_configuracion_de_proveedores } from './detalle_de_configuracion_de_proveedores';
import { Detalle_Solicitud_de_Cotizacion } from './Detalle_Solicitud_de_Cotizacion';


export class Solicitud_de_cotizacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Usuario_que_Registra', [''])
    Usuario_que_Registra = null;
    Usuario_que_Registra_Spartan_User: Spartan_User;
    @FormField('Fecha_de_Registro', [''])
    Fecha_de_Registro = '';
    @FormField('Hora_de_Registro', [''])
    Hora_de_Registro = '';
    @FormField('detalle_de_configuracion_de_proveedoresItems', [], detalle_de_configuracion_de_proveedores,  true)
    detalle_de_configuracion_de_proveedoresItems: FormArray;

    @FormField('Detalle_Solicitud_de_CotizacionItems', [], Detalle_Solicitud_de_Cotizacion,  true)
    Detalle_Solicitud_de_CotizacionItems: FormArray;

    @FormField('Mensaje_de_correo', [''])
    Mensaje_de_correo = '';
    @FormField('Comentarios_Adicionales', [''])
    Comentarios_Adicionales = '';
    @FormField('Folio_Solicitud_de_Cotizacion', [''])
    Folio_Solicitud_de_Cotizacion = '';

     @FormField('Solicitud_de_cotizacions', [''])
     Solicitud_de_cotizacions: Solicitud_de_cotizacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

