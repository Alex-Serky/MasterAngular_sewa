import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { Toastr } from 'src/app/shared/models/toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  private toastr: BehaviorSubject<Toastr|null> = new BehaviorSubject<Toastr|null>(null);

  public closeToastr() {
    this.toastr.next(null);
  }

  readonly toastr$: Observable<Toastr|null> = this.toastr.asObservable();

  constructor() { }

  // La méthode permet de modifier l'état du service de manière à afficher un toastr
  showToastr(toastr: Toastr): void {
    timer(0, 3000).pipe(take(2)).subscribe(i => {
      if (i === 0) {
        this.toastr.next(toastr);
      } else {
        this.toastr.next(null);
      }
    });
  }


}
