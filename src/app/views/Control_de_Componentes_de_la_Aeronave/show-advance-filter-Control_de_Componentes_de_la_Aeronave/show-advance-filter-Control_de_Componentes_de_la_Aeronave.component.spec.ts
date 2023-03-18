import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterControl_de_Componentes_de_la_AeronaveComponent } from './show-advance-filter-Control_de_Componentes_de_la_Aeronave.component';

describe('ShowAdvanceFilterControl_de_Componentes_de_la_AeronaveComponent', () => {
  let component: ShowAdvanceFilterControl_de_Componentes_de_la_AeronaveComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterControl_de_Componentes_de_la_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterControl_de_Componentes_de_la_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterControl_de_Componentes_de_la_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
