import { Injectable, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpartanUserService } from 'src/app/api-services/spartan-user.service';

@Injectable({
  providedIn: 'root'
})

export class Usuario_del_SistemaIndexRules {
  public operation = "List";
  public MRWhere = '';
  public MROrder = '';
  constructor(private _user: SpartanUserService, private route: Router) {
  }

  rulesAfterViewInit() {
    const operation = this.operation;
    // NEWBUSINESSRULE_BEFORECREATIONLIST//
  }

  rulesOnInit() {
    const operation = this.operation;
    // NEWBUSINESSRULE_AFTERCREATIONLIST//
    this._user.current().subscribe((result) => {
      let roles = [9, 11, 12];
      if (roles.includes(result.Role)) {
        this.route.navigate(['/Usuario_del_Sistema/edit/' + result.Id_User]);
      }
    })
  }

  rulesAfterViewChecked() {
    const operation = this.operation;
    // NEWBUSINESSRULE_AFTERVIEWCHECKEDLIST//
  }

}
