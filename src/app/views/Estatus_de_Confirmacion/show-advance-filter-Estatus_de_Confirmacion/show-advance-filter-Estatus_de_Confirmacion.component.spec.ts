import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_ConfirmacionComponent } from './show-advance-filter-Estatus_de_Confirmacion.component';

describe('ShowAdvanceFilterEstatus_de_ConfirmacionComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_ConfirmacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_ConfirmacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_ConfirmacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_ConfirmacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
