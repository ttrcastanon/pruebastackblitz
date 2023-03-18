import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tarifas_de_Vida  extends BaseView {
    @FormField('Folio', [0, Validators.required])
    Folio = 0;
    @FormField('Ano', [0, Validators.required])
    Ano = null;
    @FormField('Contrato', ['', Validators.required])
    Contrato = '';
    @FormField('Fecha_de_Alta', ['', Validators.required])
    Fecha_de_Alta = '';
    @FormField('Poliza_Padre', ['', Validators.required])
    Poliza_Padre = '';
    @FormField('Nombre', ['', Validators.required])
    Nombre = '';
    @FormField('Fecha_de_Nacimiento', ['', Validators.required])
    Fecha_de_Nacimiento = '';
    @FormField('BIT', ['', Validators.required])
    BIT = null;
    @FormField('CAI', ['', Validators.required])
    CAI = null;
    @FormField('IMADP', ['', Validators.required])
    IMADP = null;
    @FormField('ISEF', ['', Validators.required])
    ISEF = null;
    @FormField('FALL_VG', ['', Validators.required])
    FALL_VG = null;
    @FormField('Prima_Total', ['', Validators.required])
    Prima_Total = null;

     @FormField('Tarifas_de_Vidas', [''])
     Tarifas_de_Vidas: Tarifas_de_Vida[] = [];
        
}

