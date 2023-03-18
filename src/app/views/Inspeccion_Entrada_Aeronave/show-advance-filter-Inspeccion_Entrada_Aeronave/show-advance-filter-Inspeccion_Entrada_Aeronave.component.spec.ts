import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterInspeccion_Entrada_AeronaveComponent } from './show-advance-filter-Inspeccion_Entrada_Aeronave.component';

describe('ShowAdvanceFilterInspeccion_Entrada_AeronaveComponent', () => {
  let component: ShowAdvanceFilterInspeccion_Entrada_AeronaveComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterInspeccion_Entrada_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterInspeccion_Entrada_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterInspeccion_Entrada_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
