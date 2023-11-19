import { ApplicationConfig } from '@angular/core';
import { TitleStrategy, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { CustomTitleStrategy } from './title-strategy';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), { provide: TitleStrategy, useClass: CustomTitleStrategy }],
};
