import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/core/services/layout.service';

@Component({
  selector: 'al-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  homePath: string = 'home';
  loginPath: string = 'login';
  registerPath: string = 'register';

  constructor(
    private router: Router,
    private layoutService: LayoutService) { }

  ngOnInit(): void {}

  // Cette méthode permet de déterminer si la route passé en paramètre est la route courante ou non, sous la forme d'un booléen.
  public isActive(page: string): boolean {
    return this.router.isActive(page, true);
  }

  // Cette méthode permet de rediriger l'utilisateur vers une autre route.
  public navigate(page: string): void {
    this.router.navigate([page]);
  }

  toggleSidenav() {
    this.layoutService.toggleSidenav();
  }

}
