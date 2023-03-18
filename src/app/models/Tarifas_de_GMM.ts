import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Tipo_de_Tarifa_de_GMM } from './Tipo_de_Tarifa_de_GMM';
import { Genero } from './Genero';


export class Tarifas_de_GMM  extends BaseView {
    @FormField('Folio', [0, Validators.required])
    Folio = 0;
    @FormField('Ano', [0, Validators.required])
    Ano = null;
    @FormField('Tipo_de_Tarifa', [''])
    Tipo_de_Tarifa = null;
    Tipo_de_Tarifa_Tipo_de_Tarifa_de_GMM: Tipo_de_Tarifa_de_GMM;
    @FormField('Poliza', ['', Validators.required])
    Poliza = '';
    @FormField('Edad_desde', [0, Validators.required])
    Edad_desde = null;
    @FormField('Edad_hasta', [0, Validators.required])
    Edad_hasta = null;
    @FormField('Genero', [''])
    Genero = null;
    Genero_Genero: Genero;
    @FormField('Monto', ['', Validators.required])
    Monto = null;

     @FormField('Tarifas_de_GMMs', [''])
     Tarifas_de_GMMs: Tarifas_de_GMM[] = [];
        
}

