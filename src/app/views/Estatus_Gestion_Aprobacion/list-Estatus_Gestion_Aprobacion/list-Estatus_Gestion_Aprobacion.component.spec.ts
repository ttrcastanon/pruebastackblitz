import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_Gestion_AprobacionComponent } from './list-Estatus_Gestion_Aprobacion.component';

describe('ListEstatus_Gestion_AprobacionComponent', () => {
  let component: ListEstatus_Gestion_AprobacionComponent;
  let fixture: ComponentFixture<ListEstatus_Gestion_AprobacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_Gestion_AprobacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_Gestion_AprobacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
