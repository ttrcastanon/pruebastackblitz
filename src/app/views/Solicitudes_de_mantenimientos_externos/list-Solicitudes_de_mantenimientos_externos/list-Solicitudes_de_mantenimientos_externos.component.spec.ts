import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSolicitudes_de_mantenimientos_externosComponent } from './list-Solicitudes_de_mantenimientos_externos.component';

describe('ListSolicitudes_de_mantenimientos_externosComponent', () => {
  let component: ListSolicitudes_de_mantenimientos_externosComponent;
  let fixture: ComponentFixture<ListSolicitudes_de_mantenimientos_externosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSolicitudes_de_mantenimientos_externosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSolicitudes_de_mantenimientos_externosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
