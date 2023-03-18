import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';
import { Tipo_de_vuelo } from './Tipo_de_vuelo';
import { Concepto_de_Gasto_de_Empleado } from './Concepto_de_Gasto_de_Empleado';
import { Detalle_Configuracion_de_Politicas_de_Viaticos } from './Detalle_Configuracion_de_Politicas_de_Viaticos';


export class Configuracion_de_Politicas_de_Viaticos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Fecha_de_Ultima_Modificacion', [''])
    Fecha_de_Ultima_Modificacion = '';
    @FormField('Hora_de_Ultima_Modificacion', [''])
    Hora_de_Ultima_Modificacion = '';
    @FormField('Usuario_que_Modifica', [''])
    Usuario_que_Modifica = null;
    Usuario_que_Modifica_Spartan_User: Spartan_User;
    @FormField('Tipo_de_vuelo', [''])
    Tipo_de_vuelo = null;
    Tipo_de_vuelo_Tipo_de_vuelo: Tipo_de_vuelo;
    @FormField('Concepto', [''])
    Concepto = null;
    Concepto_Concepto_de_Gasto_de_Empleado: Concepto_de_Gasto_de_Empleado;
    @FormField('Detalle_Configuracion_de_Politicas_de_ViaticosItems', [], Detalle_Configuracion_de_Politicas_de_Viaticos,  true)
    Detalle_Configuracion_de_Politicas_de_ViaticosItems: FormArray;


     @FormField('Configuracion_de_Politicas_de_Viaticoss', [''])
     Configuracion_de_Politicas_de_Viaticoss: Configuracion_de_Politicas_de_Viaticos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

