import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Cliente } from './Cliente';


export class Detalle_Empresas_Conf_Usuario  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    Configuracion_de_usuarios = 0;
    @FormField('Empresa', [''])
    Empresa = null;
    Empresa_Cliente: Cliente;

     @FormField('Detalle_Empresas_Conf_Usuarios', [''])
     Detalle_Empresas_Conf_Usuarios: Detalle_Empresas_Conf_Usuario[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

