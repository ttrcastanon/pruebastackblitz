import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Detalle_de_Materiales } from './Detalle_de_Materiales';
import { Aeronave } from './Aeronave';
import { Modelos } from './Modelos';
import { Detalle_de_Agregar_Proveedor_Materiales } from './Detalle_de_Agregar_Proveedor_Materiales';


export class Comparativo_de_Proveedores_Materiales  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Folio_MR_Materiales', [''])
    Folio_MR_Materiales = null;
    Folio_MR_Materiales_Detalle_de_Materiales: Detalle_de_Materiales;
    @FormField('Folio_MR_Fila_Materiales', [''])
    Folio_MR_Fila_Materiales = null;
    Folio_MR_Fila_Materiales_Detalle_de_Materiales: Detalle_de_Materiales;
    @FormField('No__Solicitud', [0])
    No__Solicitud = null;
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Cantidad', [0])
    Cantidad = null;
    @FormField('Matricula', [''])
    Matricula = null;
    Matricula_Aeronave: Aeronave;
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('No_Reporte', [0])
    No_Reporte = null;
    @FormField('Condicion_de_la_parte', [0])
    Condicion_de_la_parte = null;
    @FormField('Razon_de_la_Solicitud', [''])
    Razon_de_la_Solicitud = '';
    @FormField('Estatus', [''])
    Estatus = '';
    @FormField('Detalle_de_Agregar_Proveedor_MaterialesItems', [], Detalle_de_Agregar_Proveedor_Materiales,  true)
    Detalle_de_Agregar_Proveedor_MaterialesItems: FormArray;

    @FormField('Observaciones', [''])
    Observaciones = '';
    @FormField('Estatus2', [''])
    Estatus2 = '';

     @FormField('Comparativo_de_Proveedores_Materialess', [''])
     Comparativo_de_Proveedores_Materialess: Comparativo_de_Proveedores_Materiales[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

