import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterDocumentacion_de_PasajeroComponent } from './show-advance-filter-Documentacion_de_Pasajero.component';

describe('ShowAdvanceFilterDocumentacion_de_PasajeroComponent', () => {
  let component: ShowAdvanceFilterDocumentacion_de_PasajeroComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterDocumentacion_de_PasajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterDocumentacion_de_PasajeroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterDocumentacion_de_PasajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
