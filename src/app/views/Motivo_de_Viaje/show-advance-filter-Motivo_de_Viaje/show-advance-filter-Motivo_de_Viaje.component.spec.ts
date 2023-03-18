import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterMotivo_de_ViajeComponent } from './show-advance-filter-Motivo_de_Viaje.component';

describe('ShowAdvanceFilterMotivo_de_ViajeComponent', () => {
  let component: ShowAdvanceFilterMotivo_de_ViajeComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterMotivo_de_ViajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterMotivo_de_ViajeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterMotivo_de_ViajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
