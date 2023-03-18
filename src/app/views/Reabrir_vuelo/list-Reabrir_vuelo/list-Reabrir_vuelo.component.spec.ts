import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReabrir_vueloComponent } from './list-Reabrir_vuelo.component';

describe('ListReabrir_vueloComponent', () => {
  let component: ListReabrir_vueloComponent;
  let fixture: ComponentFixture<ListReabrir_vueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListReabrir_vueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReabrir_vueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
