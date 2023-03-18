import { Component } from '@angular/core';
import {
  Event,
  Router,
  NavigationStart,
  NavigationEnd,
} from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { PlatformLocation } from '@angular/common';
import { CargarScriptsService } from './shared/services/cargar-scripts.service';
import { Script } from './models/enums/script.enum';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { AppService } from './app.service';
import { CierreSessionInactividadComponent } from '../app/views/Cierre_Session_Inactividad/cierre-session-inactividad.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private COUNTDOWN_FOR_IDLE: number = 1200;
  private COUNTDOWN_FOR_TIMEOUT: number = 120;

  modalOpen: boolean = false;
  timedOut = false;
  lastPing?: Date = null;
  title = 'angular-idle-timeout';

  currentUrl: string;
  routeLoaded: boolean = false;

  constructor(private loadScript: CargarScriptsService, public _router: Router, location: PlatformLocation, private spinner: NgxSpinnerService
    , private idle: Idle, private appService: AppService, private matDialog: MatDialog) {

    // method set time for detect idle
    idle.setIdle(this.COUNTDOWN_FOR_IDLE);
    // methos for set time, for trigger exit action
    idle.setTimeout(this.COUNTDOWN_FOR_TIMEOUT);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    //enter on idle
    idle.onIdleStart.subscribe(() => {
      if (!this.modalOpen) {
        this.fnModalAvisoInactividad();
        this.modalOpen = true;
        idle.clearInterrupts();
      }
    });
    //count emmiter
    idle.onTimeoutWarning.subscribe((countdown: number) => {
      this.appService.setCounter(countdown);
    });
    //action user
    idle.onIdleEnd.subscribe(() => {
      if (this.modalOpen) {
        this.reset();
      }
    });
    idle.onTimeout.subscribe(() => {
      this.timedOut = true;
      this.fnCloseModalAvisoInactividad();
      idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);//add
      this.modalOpen = false;//yaestaba
      this.reset();//add
      this.appService.setUserLoggedIn(false);
      this._router.navigate(['/']);
    });

    this.appService.getContinueSession().subscribe(continueSession => {
      if (continueSession) {
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        this.modalOpen = false;
        this.reset();
      } else {
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        this.modalOpen = false;
        this.reset();
        this.appService.setUserLoggedIn(false);
        this._router.navigate(['/']);
      }
    });

    // sets the ping interval to 15 seconds
    // keepalive.interval(15);

    // keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.appService.getUserLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        idle.watch()
        this.timedOut = false;
      } else {
        idle.stop();
      }
    });


    //this.loadScript.carga(Script.Custom,['general']);
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.spinner.show('primary');
        location.onPopState(() => {
          window.location.reload();
        });
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        this.spinner.hide('primary');
        this.routeLoaded = true;
      }
      window.scrollTo(0, 0);
    });
  }

  reset() {
    this.idle.watch();
    this.timedOut = false;
  }

  fnModalAvisoInactividad() {
    this.matDialog.open(CierreSessionInactividadComponent, {
      width: '50%'
    });
  }

  fnCloseModalAvisoInactividad() {
    this.matDialog.closeAll()
  }
}