import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpMessageComponent } from './pop-up-message.component';

describe('PopUpMessageComponent', () => {
  let component: PopUpMessageComponent;
  let fixture: ComponentFixture<PopUpMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopUpMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopUpMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
