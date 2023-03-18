import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';
import { Unidad } from './Unidad';


export class Salida_en_almacen  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No__de_Parte___Descripcion', [''])
    No__de_Parte___Descripcion = '';
    @FormField('Solicitante', [''])
    Solicitante = null;
    Solicitante_Spartan_User: Spartan_User;
    @FormField('Cant__Solicitada', [''])
    Cant__Solicitada = null;
    @FormField('Und_', [''])
    Und_ = null;
    Und__Unidad: Unidad;
    @FormField('Entregado_a', [''])
    Entregado_a = null;
    Entregado_a_Spartan_User: Spartan_User;
    @FormField('Cant__a_entregar', [0])
    Cant__a_entregar = null;
    @FormField('Und2', [''])
    Und2 = null;
    Und2_Unidad: Unidad;
    @FormField('IdSalidaAlmacen', [''])
    IdSalidaAlmacen = '';

     @FormField('Salida_en_almacens', [''])
     Salida_en_almacens: Salida_en_almacen[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

