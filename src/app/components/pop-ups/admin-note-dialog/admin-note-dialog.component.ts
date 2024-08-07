// admin-note-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-note-dialog',
  templateUrl: './admin-note-dialog.component.html',
  // : ['./admin-note-dialog.component.scss']
})
export class AdminNoteDialogComponent {
  note: string;

  constructor(
    public dialogRef: MatDialogRef<AdminNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { note: string }
  ) {
    this.note = data.note;
  }

  save() {
    this.dialogRef.close(this.note);
  }
}