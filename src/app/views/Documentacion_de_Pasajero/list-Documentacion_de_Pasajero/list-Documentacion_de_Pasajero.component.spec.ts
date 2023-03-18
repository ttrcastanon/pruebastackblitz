import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDocumentacion_de_PasajeroComponent } from './list-Documentacion_de_Pasajero.component';

describe('ListDocumentacion_de_PasajeroComponent', () => {
  let component: ListDocumentacion_de_PasajeroComponent;
  let fixture: ComponentFixture<ListDocumentacion_de_PasajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDocumentacion_de_PasajeroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDocumentacion_de_PasajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
