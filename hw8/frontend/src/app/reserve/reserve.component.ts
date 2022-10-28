import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css'],
})
export class ReserveComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  form!: FormGroup;
  email_input: any;
  calendar_date_input: any;
  min_date: any;
  min_year: any;
  min_month: any;
  min_day: any;
  min_date_string: any;

  print_errors() {
    console.log('email errors');
    console.log(this.form.get('email')?.errors);
    console.log('date errors');
    console.log(this.form.get('date')?.errors);

    console.log(this.form.get('email')?.touched);
    console.log(this.form.get('date')?.touched);
    console.log(this.form.get('email')?.dirty);
    console.log(this.form.get('date')?.dirty);
  }

  open_modal(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        () => {},
        () => {}
      );
  }

  isFieldValid(field: string) {
    return !this.form.get(field)!.valid && this.form.get(field)!.touched;
  }

  // validate form on submit
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  onSubmit() {
    console.log(this.form);
    if (this.form.valid) {
      console.log('form submitted');
      console.log(this.email_input);
      console.log(this.calendar_date_input);
    } else {
      this.validateAllFormFields(this.form);

      console.log('form not submitted');
    }
  }

  ngOnInit(): void {
    // set min date to todays date
    this.min_date = new Date();
    this.min_year = this.min_date.getFullYear();
    this.min_month = this.min_date.getMonth() + 1;
    this.min_day = this.min_date.getDate();
    this.min_date_string =
      this.min_year + '-' + this.min_month + '-' + this.min_day;

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      date: [, [Validators.required]],
    });
  }
}
