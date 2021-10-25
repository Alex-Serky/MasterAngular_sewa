import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { ToastrService } from './toastr.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private toastrService: ToastrService) { }

  handleError(error: any) {
    // Appeler le service toastr pour afficher le message d'erreur à l'utilisateur.
    this.toastrService.showToastr({
    category: 'danger',
    message: error.error.error.message
    });
    return throwError(error); // Retourner l'erreur levée
  }
}