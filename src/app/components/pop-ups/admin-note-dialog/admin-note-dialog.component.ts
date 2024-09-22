// admin-note-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminNoteData } from '../../../services/building/building.model';

@Component({
  selector: 'app-admin-note-dialog',
  templateUrl: './admin-note-dialog.component.html',
  // : ['./admin-note-dialog.component.scss']
})
export class AdminNoteDialogComponent {
  note: string;

  constructor(
    public dialogRef: MatDialogRef<AdminNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { note: AdminNoteData }
  ) {
    this.note = data.note.text;
  }

  save() {
    this.dialogRef.close(this.note);
  }
}