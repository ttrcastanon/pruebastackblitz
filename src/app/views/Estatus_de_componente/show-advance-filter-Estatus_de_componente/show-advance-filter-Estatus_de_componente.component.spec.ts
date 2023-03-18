import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_componenteComponent } from './show-advance-filter-Estatus_de_componente.component';

describe('ShowAdvanceFilterEstatus_de_componenteComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_componenteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_componenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_componenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_componenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
