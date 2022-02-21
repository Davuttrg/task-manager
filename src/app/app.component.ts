import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { Project, User, UserProjects } from './interfaces/Interfaces';
import { AlertifyService } from './services/alertify.service';
import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  me: User | undefined;
  loading: boolean = true;
  projects: Project[] = [];
  constructor(
    private _router: Router,
    public _auth: AuthService,
    private _firebase: FirebaseService,
    private _dialog: MatDialog,
    private _alert: AlertifyService
  ) {}
  async ngOnInit() {
    this.subscribeNewProject();
    await this._auth.getState();
    this._auth.$getactiveUser.pipe().subscribe((data: any) => {
      if (data != null) {
        this.me = data;
        if (this.projects.length == 0) this.getProjects();
      } else {
        this.me = undefined;
        this.projects = [];
      }
      this.loading = false;
    });
  }
  async getProjects() {
    let userProjects = await this._firebase.getDataByFilter<UserProjects>(
      'userProjects',
      'userId',
      this._auth.me.uid,
      '=='
    );
    console.log('this._auth.me.uid :', this._auth.me.uid, userProjects);
    if (userProjects.length > 0) {
      this.projects = await this._firebase.getDataByFilter<Project>(
        'project',
        'uid',
        userProjects.map((item) => item.projectId),
        'in'
      );
    }
  }
  login() {
    this._router.navigate(['login']);
  }
  logOut() {
    this.loading = true;
    this._auth.logOut();
    setTimeout(() => {
      this.me = undefined;
      this.loading = false;
      this._router.navigate(['/login']);
    }, 1000);
  }
  setProject(project: string) {
    console.log(project);
  }
  createProject() {
    const dialogRef = this._dialog.open(CreateProjectComponent, {
      width: '50%',
      height: '40%',
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then(async (result) => {
        if (result) {
          let projectObj: Project = {
            name: result.value,
            uid: this._firebase.getNewUid(),
          };
          let newProject = await this._firebase.addData('project', projectObj);
          await this._firebase.addData('userProjects', {
            projectId: projectObj.uid,
            userId: this.me?.uid,
          });
          console.log(`Dialog result: ${result.value}`);
          projectObj.id = newProject.id;
          this.projects.push(projectObj);
          this._alert.message(
            `Your project named ${projectObj.name} has been created successfully`
          );
          this._router.navigate(['/board', projectObj.uid]);
        }
      });
  }
  getAvatar() {
    return `https://avatars.dicebear.com/api/initials/:${this.me?.email?.substr(
      0,
      2
    )}.svg`;
  }
  subscribeNewProject() {
    this._firebase.$createProject.subscribe(() => this.createProject());
  }
}
