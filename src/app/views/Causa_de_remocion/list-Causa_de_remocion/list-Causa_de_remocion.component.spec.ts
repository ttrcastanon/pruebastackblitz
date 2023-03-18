import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCausa_de_remocionComponent } from './list-Causa_de_remocion.component';

describe('ListCausa_de_remocionComponent', () => {
  let component: ListCausa_de_remocionComponent;
  let fixture: ComponentFixture<ListCausa_de_remocionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCausa_de_remocionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCausa_de_remocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
