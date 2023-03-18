import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_remocionComponent } from './show-advance-filter-Estatus_de_remocion.component';

describe('ShowAdvanceFilterEstatus_de_remocionComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_remocionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_remocionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_remocionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_remocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
