import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-curriculum',
  templateUrl: './html-editor-dialog.component.html',
  styleUrls: ['./html-editor-dialog.component.sass']
})
export class HtmlEditorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<HtmlEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
