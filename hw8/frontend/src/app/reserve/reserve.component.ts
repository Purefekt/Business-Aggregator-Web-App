import { Component, OnInit, Injectable } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  NgbDatepickerConfig,
  NgbDateAdapter,
  NgbDateStruct,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
@Injectable()
export class CustomDateAdapter {
  fromModel(value: string): NgbDateStruct {
    if (!value) return null!;
    let parts = value.split('/');
    return {
      year: +parts[0],
      month: +parts[1],
      day: +parts[2],
    } as NgbDateStruct;
  }

  toModel(date: NgbDateStruct): string {
    // from internal model -> your mode
    return date
      ? date.year +
          '/' +
          ('0' + date.month).slice(-2) +
          '/' +
          ('0' + date.day).slice(-2)
      : null!;
  }
}
@Injectable()
export class CustomDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (!value) return null!;
    let parts = value.split('/');
    return {
      year: +parts[0],
      month: +parts[1],
      day: +parts[2],
    } as NgbDateStruct;
  }
  format(date: NgbDateStruct): string {
    return date
      ? ('0' + date.month).slice(-2) +
          '/' +
          ('0' + date.day).slice(-2) +
          '/' +
          date.year
      : null!;
  }
}

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class ReserveComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private config: NgbDatepickerConfig
  ) {
    const current = new Date();
    config.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
    config.outsideDays = 'hidden';
  }

  calendar_date_input: any;
  print_calendar_date_input() {
    console.log(this.calendar_date_input);
  }

  close_result = '';
  open_modal(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.calendar_date_input = null;
          this.close_result = `Closed with ${result}`;
        },
        (reason) => {
          this.calendar_date_input = null;
          this.close_result = `Dismissed ${this.get_dismissed_reason(reason)}`;
        }
      );
  }
  private get_dismissed_reason(reason: any) {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {}
}
