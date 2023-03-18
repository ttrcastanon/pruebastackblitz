import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Herramientas } from './Herramientas';
import { Spartan_User } from './Spartan_User';


export class Detalle_de_Herramientas_y_Equipo_Prestado extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Herramientas_y_Equipo_Prestado = 0;
    @FormField('No__de_Parte___Descripcion', ['', Validators.required])
    No__de_Parte___Descripcion = null;
    No__de_Parte___Descripcion_Herramientas: Herramientas;
    @FormField('No__de_Serie', [''])
    No__de_Serie = '';
    @FormField('Fecha_de_Solicitud', ['', Validators.required])
    Fecha_de_Solicitud = '';
    @FormField('Fecha_de_Entrega', ['', Validators.required])
    Fecha_de_Entrega = '';
    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Recibio', [''])
    Recibio = null;
    Recibio_Spartan_User: Spartan_User;

    @FormField('Detalle_de_Herramientas_y_Equipo_Prestados', [''])
    Detalle_de_Herramientas_y_Equipo_Prestados: Detalle_de_Herramientas_y_Equipo_Prestado[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}

