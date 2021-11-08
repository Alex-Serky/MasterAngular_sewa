import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'al-dashboard-pomodoro-progress',
  templateUrl: './dashboard-pomodoro-progress.component.html',
  styleUrls: ['./dashboard-pomodoro-progress.component.scss']
})
export class DashboardPomodoroProgressComponent implements OnInit {

  // On déclare deux nouvelles propriétés internes au composant
  currentProgress: number;
  percentage: number;

  // On récupère les propriétés d'entrée transmises par le composant parent
  @Input()
  set progress(progress: number) {
    this.currentProgress = progress;
    this.computePercentage();
  }

  @Input() maxProgress: number;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Permet de mettre à jour le pourcentage affiché dans la barre de progression.
   * @returns
   */
  computePercentage() {
    if(!this.currentProgress || !this.maxProgress) {
      this.percentage = 0;
      return;
    }
    this.percentage = Math.floor(this.currentProgress/this.maxProgress * 100);
  }

}
