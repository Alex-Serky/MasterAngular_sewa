import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'al-home-features',
  templateUrl: './home-features.component.html',
  styles: [
  ]
})
export class HomeFeaturesComponent implements OnInit {

  // Le type "features" peut vous sembler complexe,
  // mais il s'agit surtout d'une lourdeur de syntaxe.
  // Idéalement, on pourrait créer une interface Feature pour représenter ce type.
  // Mais ici on va plutôt se concentrer sur l'interaction entre les composants...
  features: { title: string, description: string, icon: string }[];

  constructor() { }

  ngOnInit() {
    this.features = [
      {
        title: 'Planifier sa semaine',
        description: 'Visibilité sur les 7 prochains jours',
        icon: 'assets/img/calendar.svg'
      },
      {
        title: 'Atteindre ses objectifs',
        description: 'Priorisation des tâches',
        icon: 'assets/img/award.svg'
      },
      {
        title: 'Analyser sa productivité',
        description: 'Visualiser le travail accompli',
        icon: 'assets/img/diagram.svg'
      }
    ];
  }

}
