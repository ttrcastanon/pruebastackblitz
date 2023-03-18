import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDocumentacion_de_AeronaveComponent } from './list-Documentacion_de_Aeronave.component';

describe('ListDocumentacion_de_AeronaveComponent', () => {
  let component: ListDocumentacion_de_AeronaveComponent;
  let fixture: ComponentFixture<ListDocumentacion_de_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDocumentacion_de_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDocumentacion_de_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
