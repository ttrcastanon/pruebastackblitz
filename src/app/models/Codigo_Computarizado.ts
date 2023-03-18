import { BaseView } from '../shared/base-views/base-view';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { Modelos } from './Modelos';


export class Codigo_Computarizado extends BaseView {
    @FormField('Modelo', [''])
    Modelo = null;
    Modelo_Modelos: Modelos;
    @FormField('Codigo', [''])
    Codigo = '';
    @FormField('Descripcion', [''])
    Descripcion = '';
    @FormField('Tiempo_Estandar', [''])
    Tiempo_Estandar = '';
    @FormField('Descripcion_Busqueda', [''])
    Descripcion_Busqueda = '';
    @FormField('Por_Defecto_en_Cotizacion', [false])
    Por_Defecto_en_Cotizacion = false;

    @FormField('Codigo_Computarizados', [''])
    Codigo_Computarizados: Codigo_Computarizado[] = [];

    edit = false;
    isNew = false;
    IsDeleted = false;
}