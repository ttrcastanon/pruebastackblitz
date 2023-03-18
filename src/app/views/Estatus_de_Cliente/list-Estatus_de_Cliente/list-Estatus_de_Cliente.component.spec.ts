import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_ClienteComponent } from './list-Estatus_de_Cliente.component';

describe('ListEstatus_de_ClienteComponent', () => {
  let component: ListEstatus_de_ClienteComponent;
  let fixture: ComponentFixture<ListEstatus_de_ClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_ClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_ClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
