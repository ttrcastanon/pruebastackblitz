import { ObjectMenu } from './../../models/object-menu.';
import { SpartanUserService } from './../../api-services/spartan-user.service';
import { SpartanUser } from './../../models/spartan-user.model';
import { SeguridadService } from './../../api-services/seguridad.service';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, ElementRef, OnInit, Renderer2, HostListener, ViewEncapsulation } from '@angular/core';
import { ROUTES } from './sidebar-items';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass', './sidebar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})

export class SidebarComponent implements OnInit {

  public sidebarItems: any[];
  showMenu = '';
  showSubMenu = '';
  public innerHeight: any;
  public bodyTag: any;
  listMaxHeight: string;
  listMaxWidth: string;
  headerHeight = 60;

  menuItems: ObjectMenu[];
  user: SpartanUser;
  searchMenu = new FormControl("")
  menuItemsTemporal: ObjectMenu[];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private _seguridad: SeguridadService,
    private _user: SpartanUserService
  ) {

  }

  @HostListener('window:resize', ['$event'])
  windowResizecall(event) {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }

  callMenuToggle(event: any, element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
    const hasClass = event.target.classList.contains('toggled');
    if (hasClass) {
      this.renderer.removeClass(event.target, 'toggled');
    } else {
      this.renderer.addClass(event.target, 'toggled');
    }
  }

  callSubMenuToggle(element: any) {

    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }

  ngOnInit() {
    this.sidebarItems = ROUTES.filter(sidebarItem => sidebarItem);
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }

  initLeftSidebar() {
    const _this = this;
    _this.setMenuHeight();
    _this.checkStatuForResize(true);

    this.getMenuFromSecurity()

    _this._user.current().subscribe((result) => {
      this.user = result;
    })

  }

  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }

  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }

  checkStatuForResize(firstTime) {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }

  mouseHover(e) {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }

  mouseOut(e) {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }

  async getMenuFromSecurity() {
    let response: any
    this._seguridad.menu().subscribe({
      next: async result => {

        result.forEach(x => {
          x.submenu.forEach(y => {
            if (y.moduleid == 52) {
              y.badge = '4';
            }
          })
        });
        //this.menuItems = result
        response = result;

      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        setTimeout(() => {
          this.menuItemsTemporal = response;
          this.searchOnMenu(this.searchMenu.value);
        }, 1200);
      }
    });

  }

  searchOnMenu(value: string) {
    let menuTemporal = []// this.menuItemsTemporal

    this.menuItemsTemporal.forEach(element => {
      menuTemporal.push(element)
    });


    //Filtro Nivel 3 (Sub-SubMenu)
    menuTemporal.forEach(principal => {
      if (principal["submenu"].length > 0) {
        principal["submenu"].forEach(secondary => {
          if (secondary["ObjectSubMenu"].length > 0) {
            secondary["ObjectSubMenu"] = secondary["ObjectSubMenu"].filter(element => element.OptionMenu.toUpperCase().includes(value.toUpperCase()));
            principal["show"] = secondary["ObjectSubMenu"].length > 0 ? true : false
            secondary["show"] = secondary["ObjectSubMenu"].length > 0 ? true : false
          }
        });
      }
    });

    //Filtro Nivel 2 (SubMenu)
    menuTemporal.forEach(principal => {
      if (principal["submenu"].length > 0) {
        principal["submenu"] = principal["submenu"].filter(element => element.objectname.toUpperCase().includes(value.toUpperCase()) || element["show"]);
        principal["show"] = principal["submenu"].length > 0 ? true : false
      }
    });

    //Filtro Nivel 1 (Menu)
    menuTemporal = menuTemporal.filter(element => element.modulename.toUpperCase().includes(value.toUpperCase()) || element["show"]);

    this.menuItems = menuTemporal

  }


}
