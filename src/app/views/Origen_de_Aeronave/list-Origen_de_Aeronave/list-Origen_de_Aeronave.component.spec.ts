import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrigen_de_AeronaveComponent } from './list-Origen_de_Aeronave.component';

describe('ListOrigen_de_AeronaveComponent', () => {
  let component: ListOrigen_de_AeronaveComponent;
  let fixture: ComponentFixture<ListOrigen_de_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOrigen_de_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOrigen_de_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
