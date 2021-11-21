import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/Interfaces';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { users: User[] }
  ) {}
  name = new FormControl('', [Validators.required, Validators.minLength(4)]);
  description = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
  ]);
  user = new FormControl('');
  ngOnInit() {
    console.log(this.data);
  }
  getErrorMessage(field: string) {
    let text = 'Somethink went wrong';
    if (field == 'name' && this.name.hasError('required')) {
      text = 'You must enter a name';
    }
    if (field == 'name' && this.name.hasError('minlength')) {
      text = 'Value must be upper than 4 character';
    }
    if (field == 'description' && this.description.hasError('minlength')) {
      text = 'Value must be upper than 4 character';
    }
    if (field == 'description' && this.description.hasError('required')) {
      text = 'You must enter a decsription';
    }
    return text;
  }
  close() {
    if (this.name.invalid || this.description.invalid) return;
    this.dialogRef.close({
      data: { name: this.name.value, description: this.description.value ,assignee:this.user.value},
    });
  }
  getAvatar(email: string) {
    return `https://avatars.dicebear.com/api/initials/:${email.substr(
      0,
      2
    )}.svg`;
  }
}
