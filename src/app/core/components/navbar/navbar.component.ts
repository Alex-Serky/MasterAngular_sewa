import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/core/services/layout.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'al-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  homePath: string = 'home';
  loginPath: string = 'login';
  registerPath: string = 'register';
  user: User|null;
  private subscription: Subscription;

  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private authService: AuthService) { }

  ngOnInit() {
    this.subscription =
    this.authService.user$.subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

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
