import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInspeccion_Entrada_AeronaveComponent } from './list-Inspeccion_Entrada_Aeronave.component';

describe('ListInspeccion_Entrada_AeronaveComponent', () => {
  let component: ListInspeccion_Entrada_AeronaveComponent;
  let fixture: ComponentFixture<ListInspeccion_Entrada_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInspeccion_Entrada_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInspeccion_Entrada_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
