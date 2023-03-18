import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';

/*
export class Spartan_User {
  public Id_User: number;
  public Name: string;
  public Role: number;
  public Email: string;
  public Username: string;
  public Role_Spartan_User_Role: string;
  public Image:number;
  public ImageUrl:string;
}
*/

export class Spartan_User  extends BaseView {
    @FormField('Id_User', [0, Validators.required])
    Id_User = 0;
    @FormField('Name', ['', Validators.required])
    Name = '';
    @FormField('Role', [0, Validators.required])
    Role = 0;    
    @FormField('Email', ['', Validators.required])
    Email = '';
    @FormField('Username', ['', Validators.required])
    Username = '';    
    @FormField('Role_Spartan_User_Role', ['', Validators.required])
    Role_Spartan_User_Role = '';   
    @FormField('Image', [0, Validators.required])
    Image = 0;             
    @FormField('ImageUrl', ['', Validators.required])
    ImageUrl = '';  

     @FormField('Spartan_Users', [''])
     Spartan_Users: Spartan_User[] = [];
     Clave: number;
     Description: string;
        
}
