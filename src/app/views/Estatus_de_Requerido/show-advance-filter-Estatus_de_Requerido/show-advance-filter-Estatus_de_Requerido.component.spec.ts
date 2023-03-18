import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_RequeridoComponent } from './show-advance-filter-Estatus_de_Requerido.component';

describe('ShowAdvanceFilterEstatus_de_RequeridoComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_RequeridoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_RequeridoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_RequeridoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_RequeridoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
