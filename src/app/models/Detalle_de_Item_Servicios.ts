import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Unidad } from './Unidad';
import { Urgencia } from './Urgencia';


export class Detalle_de_Item_Servicios extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Solicitud_de_Servicios_para_Operaciones = 0;
    @FormField('Descripcion', ['', Validators.required])
    Descripcion = '';
    @FormField('Cantidad', [0], Validators.required)
    Cantidad = null;
    @FormField('Unidad_de_Medida', [''])
    Unidad_de_Medida = null;
    Unidad_de_Medida_Unidad: Unidad;
    @FormField('Precio', [''])
    Precio = null;
    @FormField('Urgencia', ['', Validators.required])
    Urgencia = null;
    Urgencia_Urgencia: Urgencia;
    @FormField('Fecha_requerida', ['', Validators.required])
    Fecha_requerida = '';
    @FormField('VoBo', [{ value: false, disabled: true }])
    VoBo = false;
    @FormField('Observaciones', [''])
    Observaciones = '';

    @FormField('Detalle_de_Item_Servicioss', [''])
    Detalle_de_Item_Servicioss: Detalle_de_Item_Servicios[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

