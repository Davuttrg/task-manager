import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<CreateProjectComponent>) {}
  name = new FormControl('', [Validators.required, Validators.minLength(4)]);
  ngOnInit(): void {}
  getErrorMessage() {
    let text = 'Somethink went wrong';
    if (this.name.hasError('required')) {
      text = 'You must enter a value';
    }
    if (this.name.hasError('minLength')) {
      text = 'Value must be upper than 4 character';
    }
    return text;
  }
}
