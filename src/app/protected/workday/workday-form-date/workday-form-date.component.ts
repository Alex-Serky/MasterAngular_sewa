import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DateService } from 'src/app/core/services/date.service';

@Component({
  selector: 'al-workday-form-date',
  templateUrl: './workday-form-date.component.html',
  styles: [
  ]
})
export class WorkdayFormDateComponent implements OnInit {

  @Input() dueDate: FormControl;
  @Output() dateSelected = new EventEmitter<string>();

  constructor(
    private localeService: BsLocaleService,
    private dateService: DateService) { }

  ngOnInit(): void {
    this.localeService.use('fr');
  }

  // Son rôle est d'intercepter les dates via bsValueChange
  selectDate(date: Date): void {
    if(date) {
      // Transformer en sa date d'affichage grâce à la méthode getDisplayDate
      const displayDate: string = this.dateService.getDisplayDate(date);
      this.dateSelected.emit(displayDate);
    }
  }

}
