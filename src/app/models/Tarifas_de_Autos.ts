import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Tarifas_de_Autos  extends BaseView {
    @FormField('Folio', [0, Validators.required])
    Folio = 0;
    @FormField('Ano', [0, Validators.required])
    Ano = null;
    @FormField('Poliza_padre', ['', Validators.required])
    Poliza_padre = '';
    @FormField('Poliza_hija', ['', Validators.required])
    Poliza_hija = '';
    @FormField('Contratante', ['', Validators.required])
    Contratante = '';
    @FormField('Descripcion_del_vehiculo', ['', Validators.required])
    Descripcion_del_vehiculo = '';
    @FormField('Domicilio', ['', Validators.required])
    Domicilio = '';
    @FormField('RFC', ['', Validators.required])
    RFC = '';
    @FormField('Modelo', [0, Validators.required])
    Modelo = null;
    @FormField('Forma_de_pago', ['', Validators.required])
    Forma_de_pago = '';
    @FormField('Parcialidad', ['', Validators.required])
    Parcialidad = '';
    @FormField('Paquete', ['', Validators.required])
    Paquete = '';
    @FormField('No__De_serie', ['', Validators.required])
    No__De_serie = '';
    @FormField('Placas', ['', Validators.required])
    Placas = '';
    @FormField('Tipo_de_vehiculo', ['', Validators.required])
    Tipo_de_vehiculo = '';
    @FormField('Prima_neta', ['', Validators.required])
    Prima_neta = null;
    @FormField('Derechos_de_poliza', ['', Validators.required])
    Derechos_de_poliza = null;
    @FormField('Subtotal', ['', Validators.required])
    Subtotal = null;
    @FormField('IVA', ['', Validators.required])
    IVA = null;
    @FormField('Total', ['', Validators.required])
    Total = null;

     @FormField('Tarifas_de_Autoss', [''])
     Tarifas_de_Autoss: Tarifas_de_Autos[] = [];
        
}

