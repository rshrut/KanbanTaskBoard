import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Task } from './task/task';
import { TaskComponent } from './task/task.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskDialogComponent, TaskDialogResult } from './task-dialog/task-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  imports: [
    MatToolbarModule, 
    MatIconModule,
    MatButtonModule, 
    MatCardModule,
    MatDialogModule,
    TaskComponent, 
    CommonModule,
    DragDropModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  todo: Task[] = [
    {
      title: 'Schedule Weekly Team Meeting',
      description: 'Set up a recurring meeting every Monday at 10 AM.'
    },
    {
      title: 'Prepare Monthly Report',
      description: 'Compile sales and performance data for the monthly report.'
    },
    {
      title: 'Review Code for Upcoming Release',
      description: 'Conduct a code review and provide feedback before deployment.'
    }
  ];
  inProgress : Task[] = [
    {
      title: 'Update Project Documentation',
      description: 'Ensure all project documents are up to date in the shared drive.'
    }
  ];
  done : Task[] = [];

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar){
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  private saveTasks(): void{
    const tasks = {
      todo: this.todo,
      inProgress: this.inProgress,
      done: this.done
    }
    localStorage.setItem('tasks',JSON.stringify(tasks));
  }



  private loadTasks(): void{
    const storedTasks = localStorage.getItem('tasks');
    if(storedTasks){
      const parsedTasks = JSON.parse(storedTasks);
      this.todo = parsedTasks.todo || [];
      this.inProgress = parsedTasks.inProgress || [];
      this.done = parsedTasks.done || [];
    }
  }

  newTask():void{
    const dialogRef = this.dialog.open(TaskDialogComponent,{
      width: '500px',
      data: {
        task: {},
      }
    });

    dialogRef
    .afterClosed()
    .subscribe((result: TaskDialogResult | undefined) => {
      if(!result || !result.task){
        return;
      }
      this.todo.push(result.task);
      this.saveTasks();
    } )
  }


  editTask(list: 'todo' | 'inProgress' | 'done', task: Task): void{
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: {
        task,
        enableDelete: true
      }
    });
  
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
      console.log('result', result);
  
      if (!result) {
        return; 
      }
  
      const dataList = this[list];
      const taskIndex = dataList.indexOf(task);
  
      if (result.delete) {
        dataList.splice(taskIndex, 1);
        this.snackBar.open('Task deleted successfully!', 'close', {
          duration: 2000,
          panelClass: ['error-snackbar'],
        });
      } else {
        dataList[taskIndex] = result.task;
      }
      this.saveTasks();
    });
  }

  drop(event: CdkDragDrop<Task[]>){
    if(!event.container.data || !event.container.data){
      return;
    }
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    )
    this.saveTasks();
    }

}