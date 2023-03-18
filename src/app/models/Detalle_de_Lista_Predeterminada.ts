import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Unidad } from './Unidad';
import { Urgencia } from './Urgencia';


export class Detalle_de_Lista_Predeterminada extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Lista_Predeterminada = 0;
    @FormField('Descripcion', ['', Validators.required])
    Descripcion = '';
    @FormField('Cantidad_Requerida', [0, Validators.required])
    Cantidad_Requerida = null;
    @FormField('Unidad_de_Medida', ['', Validators.required])
    Unidad_de_Medida = null;
    Unidad_de_Medida_Unidad: Unidad;
    @FormField('Urgencia', ['', Validators.required])
    Urgencia = null;
    Urgencia_Urgencia: Urgencia;
    @FormField('Aplicacion_y_Justificacion', ['', Validators.required])
    Aplicacion_y_Justificacion = '';
    @FormField('Fecha_requerida', ['', Validators.required])
    Fecha_requerida = '';
    @FormField('Observaciones', [''])
    Observaciones = '';

    @FormField('Detalle_de_Lista_Predeterminadas', [''])
    Detalle_de_Lista_Predeterminadas: Detalle_de_Lista_Predeterminada[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

