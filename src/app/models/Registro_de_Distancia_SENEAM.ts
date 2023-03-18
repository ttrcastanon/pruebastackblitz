import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Aeropuertos } from './Aeropuertos';


export class Registro_de_Distancia_SENEAM  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Aeropuerto_Origen', [''])
    Aeropuerto_Origen = null;
    Aeropuerto_Origen_Aeropuertos: Aeropuertos;
    @FormField('Aeropuerto_Destino', [''])
    Aeropuerto_Destino = null;
    Aeropuerto_Destino_Aeropuertos: Aeropuertos;
    @FormField('Distancia_SENEAM_KM', [0])
    Distancia_SENEAM_KM = null;

     @FormField('Registro_de_Distancia_SENEAMs', [''])
     Registro_de_Distancia_SENEAMs: Registro_de_Distancia_SENEAM[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

