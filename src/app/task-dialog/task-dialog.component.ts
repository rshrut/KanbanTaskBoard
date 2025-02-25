import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../task/task';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-dialog',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.css',
})
export class TaskDialogComponent {
  private backupTask: Partial<Task>;

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData,
    private snackBar: MatSnackBar
  ) {
    this.backupTask = { ...this.data.task };
  }

  cancel(): void {
    this.dialogRef.close();
  }

  saveTask(): void {
    const backupTitle = this.backupTask.title?.trim();
    const backupDescription = this.backupTask.description?.trim();

    const currentTitle = this.data.task?.title?.trim() ?? '';
    const currentDescription = this.data.task?.description?.trim() ?? '';

    if (!currentTitle && !currentDescription) {
      this.snackBar.open(
        'No fields entered. Please provide task details!',
        'close',
        {
          duration: 2000,
          panelClass: ['error-snackbar'],
        }
      );
      return;
    }

    if (
      backupTitle === currentTitle &&
      backupDescription === currentDescription
    ) {
      this.dialogRef.close();
      return;
    }

    // Determine if it's an update or a new task
    const isNewTask = !this.backupTask.title && !this.backupTask.description;

    this.snackBar.open(
      isNewTask ? 'Task added successfully!' : 'Task updated successfully!',
      'close',
      {
        duration: 2000,
        panelClass: ['success-snackbar'],
      }
    );

    this.dialogRef.close({ task: this.data.task });
  }
}

export interface TaskDialogData {
  task: Partial<Task>;
  enableDelete: boolean;
}

export interface TaskDialogResult {
  task: Task;
  delete?: boolean;
}
