import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable()
export class CustomTitleStrategy extends TitleStrategy {
  private title = inject(Title);

  constructor() {
    super();
  }

  updateTitle(routerState: RouterStateSnapshot) {
    const titleFromRoute = this.buildTitle(routerState);
    let title = 'Soundcraft Ui TestBed';
    if (titleFromRoute) {
      title = titleFromRoute + ' | ' + title;
    }
    this.title.setTitle(title);
  }
}
