import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_componenteComponent } from './list-Estatus_de_componente.component';

describe('ListEstatus_de_componenteComponent', () => {
  let component: ListEstatus_de_componenteComponent;
  let fixture: ComponentFixture<ListEstatus_de_componenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_componenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_componenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
