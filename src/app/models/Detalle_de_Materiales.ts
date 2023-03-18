import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';
import { Departamento } from './Departamento';


export class Detalle_de_Materiales  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Seguimiento_de_Solicitud_de_Compras = 0;
    @FormField('Tipo', [''])
    Tipo = '';
    @FormField('No_de_Solicitud', [''])
    No_de_Solicitud = '';
    @FormField('Solicitante', [''])
    Solicitante = null;
    Solicitante_Spartan_User: Spartan_User;
    @FormField('Fecha_de_Solicitud', [''])
    Fecha_de_Solicitud = '';
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Cantidad', [0])
    Cantidad = null;
    @FormField('Departamento', [''])
    Departamento = null;
    Departamento_Departamento: Departamento;
    @FormField('Razon_de_la_Solicitud', [''])
    Razon_de_la_Solicitud = '';
    @FormField('Urgencia', [''])
    Urgencia = '';
    @FormField('Estatus', [0])
    Estatus = null;
    @FormField('Cotizar', [false])
    Cotizar = false;
    @FormField('Folio_MR_Materiales', [''])
    Folio_MR_Materiales = '';
    @FormField('Folio_MR_fila_Materiales', [''])
    Folio_MR_fila_Materiales = '';

     @FormField('Detalle_de_Materialess', [''])
     Detalle_de_Materialess: Detalle_de_Materiales[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

