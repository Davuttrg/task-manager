import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Project, User, Task } from 'src/app/interfaces/Interfaces';
import { AddTaskComponent } from 'src/app/components/add-task/add-task.component';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AddUserComponent } from 'src/app/components/add-user/add-user.component';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  constructor(
    private _dialog: MatDialog,
    private _firebase: FirebaseService,
    private _route: ActivatedRoute,
    private _auth: AuthService,
    private _alert: AlertifyService
  ) {}
  loading: boolean = true;
  project!: Project;
  users!: User[];
  toDo!: Task[];
  inProgress!: Task[];
  done!: Task[];
  tasks!: Task[];
  async ngOnInit() {
    this._route.params.subscribe(async (routeParams) => {
      let queryParam = routeParams.id;
      if (queryParam) {
        this.loading = true;
        let project = await this._firebase.getDataByFilter<any>(
          'project',
          'uid',
          queryParam,
          '=='
        );
        this.project = project[0];
        let userOfProjects = await this._firebase.getDataByFilter<any>(
          'userProjects',
          'projectId',
          queryParam,
          '=='
        );
        this.users = await this._firebase.getDataByFilter<User>(
          'user',
          'uid',
          userOfProjects.map((item) => item.userId),
          'in'
        );
        this.tasks = await this._firebase.getDataByFilter<Task>(
          'task',
          'projectId',
          queryParam,
          '=='
        );
        this.toDo = this.tasks.filter((item: any) => item.status == 'to_do');
        this.inProgress = this.tasks.filter(
          (item: any) => item.status == 'in_progress'
        );
        this.done = this.tasks.filter((item: any) => item.status == 'done');
        this.loading = false;
      } else this.loading = false;
    });
  }
  async drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      this.loading = true;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      await this.changeStatus(event.container.id, event.item.data);
      this.loading = false;
    }
  }
  async changeStatus(container: string, task: Task) {
    let newStatus!: string;
    switch (container) {
      case 'cdk-drop-list-0':
        newStatus = 'to_do';
        break;
      case 'cdk-drop-list-1':
        newStatus = 'in_progress';
        break;
      case 'cdk-drop-list-2':
        newStatus = 'done';
        break;
    }
    task.status = newStatus;
    await this._firebase.updateData('task', task, task.id as string);
  }
  createTask() {
    const dialogRef = this._dialog.open(AddTaskComponent, {
      width: '50%',
      height: '60%',
      data: { users: this.users },
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then(async (result) => {
        if (result) {
          let newTaskObj: Task = {
            name: result.data.name,
            description: result.data.description,
            status: 'to_do',
            reporter: this._auth.me.uid,
            assignee: result.data.assignee,
            projectId: this.project.uid,
          };
          let newTask = await this._firebase.addData<Task>('task', newTaskObj);
          newTaskObj.id = newTask.id;
          this.toDo.push(newTaskObj);
        }
      });
  }
  getAvatar(email: string) {
    return `https://avatars.dicebear.com/api/initials/:${email.substr(
      0,
      2
    )}.svg`;
  }
  addUser() {
    const dialogRef = this._dialog.open(AddUserComponent, {
      width: '50%',
      height: '40%',
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then(async (result) => {
        if (result) {
          let response = await this._firebase.getDataByFilter<User>(
            'user',
            'email',
            result,
            '=='
          );
          if (!response[0]) {
            this._alert.error(`Could not find a user with ${result} mail`);
            return;
          }
          if (!this.users.some((item) => item.uid == response[0].uid)) {
            this.users.push(response[0]);
            this._alert.message('User Added');
            await this._firebase.addData('userProjects', {
              projectId: this.project.uid,
              userId: response[0].uid,
            });
          } else this._alert.error('User already exist');
        }
      });
  }
  triggerNewProject() {
    this._firebase.$createProject.next();
  }
  editTask(item: any) {
    const dialogRef = this._dialog.open(AddTaskComponent, {
      width: '50%',
      height: '60%',
      data: { users: this.users, task: item },
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then(async (result) => {
        if (result) {
          console.log('result', result);
          result.task.name = result.data.name;
          result.task.description = result.data.description;
          result.task.assignee = result.data.assignee;
          await this._firebase.updateData<Task>(
            'task',
            result.task,
            result.task.id
          );
          let index;
          switch (result.task.status) {
            case 'to_do':
              index = this.toDo.findIndex((item) => item.id == result.task.id);
              this.toDo[index] = result.task;
              break;
            case 'in_progress':
              index = this.inProgress.findIndex(
                (item) => item.id == result.task.id
              );
              this.inProgress[index] = result.task;
              break;
            case 'done':
              index = this.done.findIndex((item) => item.id == result.task.id);
              this.done[index] = result.task;
              break;
          }
        }
      });
  }
}
