import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Categoria_de_Partes } from './Categoria_de_Partes';
import { Unidad } from './Unidad';
import { Estatus_de_Requerido } from './Estatus_de_Requerido';
import { Condicion_del_item } from './Condicion_del_item';
import { Detalle_Cargar_inspecciones_de_calidad } from './Detalle_Cargar_inspecciones_de_calidad';


export class Ingreso_a_almacen  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('No__de_parte___Descripcion', [''])
    No__de_parte___Descripcion = '';
    @FormField('Categoria', [''])
    Categoria = null;
    Categoria_Categoria_de_Partes: Categoria_de_Partes;
    @FormField('Cant__Solicitada', [0])
    Cant__Solicitada = null;
    @FormField('Unidad_CS', [''])
    Unidad_CS = null;
    Unidad_CS_Unidad: Unidad;
    @FormField('Cant__Recibida', [0])
    Cant__Recibida = null;
    @FormField('Unidad_CR', [''])
    Unidad_CR = null;
    Unidad_CR_Unidad: Unidad;
    @FormField('Costo_de_Material_', [''])
    Costo_de_Material_ = null;
    @FormField('No__de_Factura', [''])
    No__de_Factura = '';
    @FormField('Costo_en_Factura_', [''])
    Costo_en_Factura_ = null;
    @FormField('Tipo_de_Cambio', [''])
    Tipo_de_Cambio = null;
    @FormField('Fecha_de_Factura', [''])
    Fecha_de_Factura = '';
    @FormField('Fecha_Estimada_de_llegada', [''])
    Fecha_Estimada_de_llegada = '';
    @FormField('Fecha_Real_de_llegada', [''])
    Fecha_Real_de_llegada = '';
    @FormField('Se_mantiene_el_No__de_Parte', [''])
    Se_mantiene_el_No__de_Parte = null;
    Se_mantiene_el_No__de_Parte_Estatus_de_Requerido: Estatus_de_Requerido;
    @FormField('No__de_Serie', [''])
    No__de_Serie = '';
    @FormField('No__de_Lote', [''])
    No__de_Lote = '';
    @FormField('Horas_acumuladas', [''])
    Horas_acumuladas = null;
    @FormField('Ciclos_acumulados', [''])
    Ciclos_acumulados = null;
    @FormField('Fecha_de_vencimiento', [''])
    Fecha_de_vencimiento = '';
    @FormField('Ubicacion_en_Almacen', [''])
    Ubicacion_en_Almacen = '';
    @FormField('Linea_de_Almacen', [''])
    Linea_de_Almacen = '';
    @FormField('Ubicacion', [''])
    Ubicacion = '';
    @FormField('Condicion', [''])
    Condicion = null;
    Condicion_Condicion_del_item: Condicion_del_item;
    @FormField('Fecha_de_Expiracion', [''])
    Fecha_de_Expiracion = '';
    @FormField('Control_de_Temperatura', [''])
    Control_de_Temperatura = null;
    @FormField('Identificacion_de_Herramienta', [''])
    Identificacion_de_Herramienta = '';
    @FormField('No__Parte_Nuevo', [''])
    No__Parte_Nuevo = '';
    @FormField('Detalle_Cargar_inspecciones_de_calidadItems', [], Detalle_Cargar_inspecciones_de_calidad,  true)
    Detalle_Cargar_inspecciones_de_calidadItems: FormArray;

    @FormField('IdIngresoAlmacen', [''])
    IdIngresoAlmacen = '';

     @FormField('Ingreso_a_almacens', [''])
     Ingreso_a_almacens: Ingreso_a_almacen[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

