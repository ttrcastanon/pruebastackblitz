import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Cliente } from './Cliente';


export class Layout_Cuentas_por_pagar  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Folio_de_carga_manual', [0])
    Folio_de_carga_manual = null;
    @FormField('Fecha', [''])
    Fecha = '';
    @FormField('RFC_Cliente', [''])
    RFC_Cliente = null;
    RFC_Cliente_Cliente: Cliente;
    @FormField('Descripcion_Cliente', [''])
    Descripcion_Cliente = null;
    Descripcion_Cliente_Cliente: Cliente;
    @FormField('Facturacion', [''])
    Facturacion = null;
    @FormField('Cobranza', [''])
    Cobranza = null;
    @FormField('Saldo30dias', [''])
    Saldo30dias = null;
    @FormField('Saldo60dias', [''])
    Saldo60dias = null;
    @FormField('Saldo90dias', [''])
    Saldo90dias = null;
    @FormField('SaldoMayor180dias', [''])
    SaldoMayor180dias = null;

     @FormField('Layout_Cuentas_por_pagars', [''])
     Layout_Cuentas_por_pagars: Layout_Cuentas_por_pagar[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

