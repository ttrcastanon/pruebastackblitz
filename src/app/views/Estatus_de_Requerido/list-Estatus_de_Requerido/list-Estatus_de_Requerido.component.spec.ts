import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_RequeridoComponent } from './list-Estatus_de_Requerido.component';

describe('ListEstatus_de_RequeridoComponent', () => {
  let component: ListEstatus_de_RequeridoComponent;
  let fixture: ComponentFixture<ListEstatus_de_RequeridoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_RequeridoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_RequeridoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
