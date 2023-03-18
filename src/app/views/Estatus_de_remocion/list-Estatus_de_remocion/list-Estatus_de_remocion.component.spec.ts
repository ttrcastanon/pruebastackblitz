import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_remocionComponent } from './list-Estatus_de_remocion.component';

describe('ListEstatus_de_remocionComponent', () => {
  let component: ListEstatus_de_remocionComponent;
  let fixture: ComponentFixture<ListEstatus_de_remocionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_remocionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_remocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
