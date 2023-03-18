import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Spartan_User } from './Spartan_User';
import { Aeronave } from './Aeronave';
import { Detalle_Toma_de_Tiempos_Componentes } from './Detalle_Toma_de_Tiempos_Componentes';


export class Toma_de_Tiempos_a_aeronaves  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Fecha_de_Registro', [''])
    Fecha_de_Registro = '';
    @FormField('Hora_de_Registro', [''])
    Hora_de_Registro = '';
    @FormField('Usuario_que_Registra', [''])
    Usuario_que_Registra = null;
    Usuario_que_Registra_Spartan_User: Spartan_User;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = '';
    @FormField('Propietario', [''])
    Propietario = '';
    @FormField('Detalle_Toma_de_Tiempos_ComponentesItems', [], Detalle_Toma_de_Tiempos_Componentes,  true)
    Detalle_Toma_de_Tiempos_ComponentesItems: FormArray;

    @FormField('Reportes_de_la_Aeronave', [''])
    Reportes_de_la_Aeronave = '';

     @FormField('Toma_de_Tiempos_a_aeronavess', [''])
     Toma_de_Tiempos_a_aeronavess: Toma_de_Tiempos_a_aeronaves[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

