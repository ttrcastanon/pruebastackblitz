import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_ConfirmacionComponent } from './list-Estatus_de_Confirmacion.component';

describe('ListEstatus_de_ConfirmacionComponent', () => {
  let component: ListEstatus_de_ConfirmacionComponent;
  let fixture: ComponentFixture<ListEstatus_de_ConfirmacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_ConfirmacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_ConfirmacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
