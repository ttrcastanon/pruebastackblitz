import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from '../../app.service';


@Component({
  selector: 'app-cierre-session-inactividad',
  templateUrl: './cierre-session-inactividad.component.html',
  styleUrls: ['./cierre-session-inactividad.component.scss']
})
export class CierreSessionInactividadComponent implements OnInit {

  public counter: number;
  //public continue: boolean;

  constructor(
    public dialogRef: MatDialogRef<CierreSessionInactividadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public appService: AppService

  ) {

    this.appService.getCounter().subscribe(counter => {
        this.counter = counter;
    })
  }

  ngOnInit(): void {
  }

  closeModalEvent(param:boolean) {
    this.dialogRef.close();
    this.appService.setContinueSession(param);
  }

}