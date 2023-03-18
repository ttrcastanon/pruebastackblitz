import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Piezas } from './Piezas';
import { Utilidad } from './Utilidad';


export class Detalle_Partes_Cotizacion  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Cotizacion = 0;
    @FormField('Numero_de_Parte', [''])
    Numero_de_Parte = null;
    Numero_de_Parte_Piezas: Piezas;
    @FormField('Ultimo_Costo_Cotizado', [''])
    Ultimo_Costo_Cotizado = null;
    @FormField('Parte_Material_conseguida_por_el_cliente', [false])
    Parte_Material_conseguida_por_el_cliente = false;
    @FormField('Costo_de_Parte', [''])
    Costo_de_Parte = null;
    @FormField('Cantidad', [0])
    Cantidad = null;
    @FormField('Utilidad', [''])
    Utilidad = null;
    Utilidad_Utilidad: Utilidad;

     @FormField('Detalle_Partes_Cotizacions', [''])
     Detalle_Partes_Cotizacions: Detalle_Partes_Cotizacion[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

