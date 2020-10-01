import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // navList=[
  //   {
  //     path:'/admin/bulk',
  //     name:'Bulk Orders'
  //   },
  //   {
  //     path:'/admin/individual',
  //     name:'Individual Orders'
  //   }
  // ]

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  loggedIn = null;
  orders = null;
  selectedorder = null;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService,
    private data:DataService,
  ) {
    this.auth.authenticationState.subscribe(res => {
      this.loggedIn = res;
    });
  }

  logout() {
    this.auth.logout();
  }
}