import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BusinessRulesComponent } from '../business-rules/business-rules.component';

@Component({
  selector: 'app-workflow-table',
  templateUrl: './workflow-table.component.html',
  styleUrls: ['./workflow-table.component.sass']
})
export class WorkflowTableComponent implements OnInit {

  constructor(
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    
  }

  OpenBusinessRule() {
    
    // let dataRow = '';
    // this.matDialog
    // .open(BusinessRulesComponent, {
    //   data: dataRow,
    //   width: '100%',
    //     minHeight: 'calc(100vh - 90px)',
    //     height : 'auto'
    // })
    // .afterClosed()
    // .subscribe((optionSelected: boolean) => {
    //   if (optionSelected) {
    //     alert('Pendiente de implementar.');
    //   }
    // });

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      'top': '20px',
      left: '10px'
    };
    dialogConfig.height = '95%';
    dialogConfig.width = '100%';
    dialogConfig.minHeight = 'calc(100vh - 40px)';
    // dialogConfig.maxWidth = '90vh';
    dialogConfig.data = {
      id: 1,
      title: 'Angular For Beginners'
    };

    const dialogRef = this.matDialog.open(BusinessRulesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => console.log("Dialog output:", data)
    );

  }

}
