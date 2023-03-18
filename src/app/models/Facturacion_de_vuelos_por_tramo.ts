import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Cliente_Facturacion } from './Cliente_Facturacion';


export class Facturacion_de_vuelos_por_tramo  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    id_Facturacion_de_vuelo = 0;
    @FormField('Numero_de_Tramo', [0])
    Numero_de_Tramo = null;
    @FormField('Tramo', [0])
    Tramo = null;
    @FormField('Monto_de_Tramo', [''])
    Monto_de_Tramo = null;
    @FormField('Porcentaje', [''])
    Porcentaje = null;
    @FormField('Empresa_Sugerida', [''])
    Empresa_Sugerida = null;
    Empresa_Sugerida_Cliente_Facturacion: Cliente_Facturacion;
    @FormField('Empresa_Seleccionada', [''])
    Empresa_Seleccionada = null;
    Empresa_Seleccionada_Cliente_Facturacion: Cliente_Facturacion;

     @FormField('Facturacion_de_vuelos_por_tramos', [''])
     Facturacion_de_vuelos_por_tramos: Facturacion_de_vuelos_por_tramo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

