import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AddUserComponent>) {}
  email = new FormControl('', [Validators.required, Validators.email]);
  ngOnInit(): void {}
  getErrorMessage() {
    let text = 'Somethink went wrong';
    if (this.email.hasError('required')) {
      text = 'You must enter a value';
    }
    if (this.email.hasError('email')) {
      text = 'Pelase enter valid email';
    }
    return text;
  }
}
