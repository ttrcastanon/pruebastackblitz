import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNombre_del_Campo_en_MSComponent } from './list-Nombre_del_Campo_en_MS.component';

describe('ListNombre_del_Campo_en_MSComponent', () => {
  let component: ListNombre_del_Campo_en_MSComponent;
  let fixture: ComponentFixture<ListNombre_del_Campo_en_MSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListNombre_del_Campo_en_MSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNombre_del_Campo_en_MSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
