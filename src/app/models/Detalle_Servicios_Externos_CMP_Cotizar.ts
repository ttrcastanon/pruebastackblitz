import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Servicios } from './Servicios';
import { Utilidad } from './Utilidad';


export class Detalle_Servicios_Externos_CMP_Cotizar  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    CMP_a_Cotizar = 0;
    @FormField('Codigo_de_Servicio', [''])
    Codigo_de_Servicio = null;
    Codigo_de_Servicio_Servicios: Servicios;
    @FormField('Ultimo_Costo_Cotizado', [''])
    Ultimo_Costo_Cotizado = null;
    @FormField('Servicio_proporcionado_por_el_cliente', [false])
    Servicio_proporcionado_por_el_cliente = false;
    @FormField('Costo_de_Servicio', [''])
    Costo_de_Servicio = null;
    @FormField('Cantidad', [0])
    Cantidad = null;
    @FormField('Utilidad', [''])
    Utilidad = null;
    Utilidad_Utilidad: Utilidad;
    @FormField('Taller_Externo', [''])
    Taller_Externo = '';
    @FormField('Motivo_de_Incumplimiento', [''])
    Motivo_de_Incumplimiento = '';

     @FormField('Detalle_Servicios_Externos_CMP_Cotizars', [''])
     Detalle_Servicios_Externos_CMP_Cotizars: Detalle_Servicios_Externos_CMP_Cotizar[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

