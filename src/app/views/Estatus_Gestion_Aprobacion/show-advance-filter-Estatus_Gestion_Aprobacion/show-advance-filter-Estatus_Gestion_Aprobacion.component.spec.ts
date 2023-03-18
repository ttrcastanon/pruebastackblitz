import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_Gestion_AprobacionComponent } from './show-advance-filter-Estatus_Gestion_Aprobacion.component';

describe('ShowAdvanceFilterEstatus_Gestion_AprobacionComponent', () => {
  let component: ShowAdvanceFilterEstatus_Gestion_AprobacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_Gestion_AprobacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_Gestion_AprobacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_Gestion_AprobacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
