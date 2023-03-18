import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Detalle_Politicas_Mano_de_Obra } from './Detalle_Politicas_Mano_de_Obra';
import { Detalle_Politicas_Cuota_Consumibles } from './Detalle_Politicas_Cuota_Consumibles';
import { Detalle_Politicas_Partes_Cliente_Contrato } from './Detalle_Politicas_Partes_Cliente_Contrato';
import { Detalle_Politicas_Partes_Cliente_No_Contrato } from './Detalle_Politicas_Partes_Cliente_No_Contrato';
import { Detalle_Politicas_Terceros } from './Detalle_Politicas_Terceros';


export class Politicas_de_Precios_y_Descuentos  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('contrato_tarifa_tecnico', [''])
    contrato_tarifa_tecnico = null;
    @FormField('contrato_tarifa_rampa', [''])
    contrato_tarifa_rampa = null;
    @FormField('sin_contrato_tarifa_tecnico', [''])
    sin_contrato_tarifa_tecnico = null;
    @FormField('sin_contrato_tarifa_rampa', [''])
    sin_contrato_tarifa_rampa = null;
    @FormField('Detalle_Politicas_Mano_de_ObraItems', [], Detalle_Politicas_Mano_de_Obra,  true)
    Detalle_Politicas_Mano_de_ObraItems: FormArray;

    @FormField('Detalle_Politicas_Cuota_ConsumiblesItems', [], Detalle_Politicas_Cuota_Consumibles,  true)
    Detalle_Politicas_Cuota_ConsumiblesItems: FormArray;

    @FormField('Detalle_Politicas_Partes_Cliente_ContratoItems', [], Detalle_Politicas_Partes_Cliente_Contrato,  true)
    Detalle_Politicas_Partes_Cliente_ContratoItems: FormArray;

    @FormField('Detalle_Politicas_Partes_Cliente_No_ContratoItems', [], Detalle_Politicas_Partes_Cliente_No_Contrato,  true)
    Detalle_Politicas_Partes_Cliente_No_ContratoItems: FormArray;

    @FormField('Detalle_Politicas_TercerosItems', [], Detalle_Politicas_Terceros,  true)
    Detalle_Politicas_TercerosItems: FormArray;

    @FormField('Clausulas_de_Cotizacion', [''])
    Clausulas_de_Cotizacion = '';


     @FormField('Politicas_de_Precios_y_Descuentoss', [''])
     Politicas_de_Precios_y_Descuentoss: Politicas_de_Precios_y_Descuentos[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

