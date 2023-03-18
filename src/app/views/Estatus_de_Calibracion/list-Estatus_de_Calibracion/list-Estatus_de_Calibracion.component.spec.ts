import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_CalibracionComponent } from './list-Estatus_de_Calibracion.component';

describe('ListEstatus_de_CalibracionComponent', () => {
  let component: ListEstatus_de_CalibracionComponent;
  let fixture: ComponentFixture<ListEstatus_de_CalibracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_CalibracionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_CalibracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
