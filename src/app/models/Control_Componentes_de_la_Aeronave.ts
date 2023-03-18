import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Propietarios } from './Propietarios';
import { Spartan_User } from './Spartan_User';
import { Detalle_Parte_Asociada_al_Componente_Aeronave } from './Detalle_Parte_Asociada_al_Componente_Aeronave';


export class Control_Componentes_de_la_Aeronave  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('N_serie', [''])
    N_serie = null;
    N_serie_Aeronave: Aeronave;
    @FormField('Propietario', [''])
    Propietario = null;
    Propietario_Propietarios: Propietarios;
    @FormField('Fecha_ultima_actualizacion', [''])
    Fecha_ultima_actualizacion = '';
    @FormField('Usuario_que_actualizo', [''])
    Usuario_que_actualizo = null;
    Usuario_que_actualizo_Spartan_User: Spartan_User;
    @FormField('Detalle_Parte_Asociada_al_Componente_AeronaveItems', [], Detalle_Parte_Asociada_al_Componente_Aeronave,  true)
    Detalle_Parte_Asociada_al_Componente_AeronaveItems: FormArray;

    @FormField('Codigo_Computarizado_Descripcion', [''])
    Codigo_Computarizado_Descripcion = '';
    @FormField('Codigo_ATA', [''])
    Codigo_ATA = '';
    @FormField('N_Parte', [''])
    N_Parte = '';
    @FormField('N_de_Serie_Filtro', [''])
    N_de_Serie_Filtro = '';

     @FormField('Control_Componentes_de_la_Aeronaves', [''])
     Control_Componentes_de_la_Aeronaves: Control_Componentes_de_la_Aeronave[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

