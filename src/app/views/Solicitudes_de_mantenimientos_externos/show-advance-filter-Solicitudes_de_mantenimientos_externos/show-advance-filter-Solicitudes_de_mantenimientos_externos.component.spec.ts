import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterSolicitudes_de_mantenimientos_externosComponent } from './show-advance-filter-Solicitudes_de_mantenimientos_externos.component';

describe('ShowAdvanceFilterSolicitudes_de_mantenimientos_externosComponent', () => {
  let component: ShowAdvanceFilterSolicitudes_de_mantenimientos_externosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterSolicitudes_de_mantenimientos_externosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterSolicitudes_de_mantenimientos_externosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterSolicitudes_de_mantenimientos_externosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
