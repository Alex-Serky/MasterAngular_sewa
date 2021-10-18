import { Component } from '@angular/core';
// On importe le service mise à disposition par angular
import { Location } from '@angular/common';

@Component({
  selector: 'al-page-not-found',
  templateUrl: './page-not-found.component.html',
  styles: [
  ]
})
export class PageNotFoundComponent {

  // On l'injecte dans le constructeur
  constructor(private location: Location) { }

  // cette méthode du service qui permet de revenir en arrière dans l'historique de navigation de l'utilisateur
  back() {
    this.location.back();
  }

}
