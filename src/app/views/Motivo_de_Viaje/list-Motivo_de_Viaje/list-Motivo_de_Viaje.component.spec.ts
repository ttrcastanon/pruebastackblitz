import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMotivo_de_ViajeComponent } from './list-Motivo_de_Viaje.component';

describe('ListMotivo_de_ViajeComponent', () => {
  let component: ListMotivo_de_ViajeComponent;
  let fixture: ComponentFixture<ListMotivo_de_ViajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMotivo_de_ViajeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMotivo_de_ViajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
