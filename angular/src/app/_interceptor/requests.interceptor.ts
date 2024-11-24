import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/index';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestsInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.headers.has('Content-Type')) {
      req = req.clone({
        headers: req.headers.set('Content-Type', 'application/json'),
      });
    }

    const token = localStorage.getItem('token');
    // @ts-ignore
    req = this.setToken(req, token);

    return next.handle(req).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            const cachedItem = { ...localStorage };
            const listItems = Object.keys(cachedItem);

            if (err.status !== 401) {
              return;
            }

            listItems.forEach((item) => {
              if (item !== 'licenceDialog') localStorage.removeItem(item);
            });

            this.router.navigate(['login']);
          }
        }
      )
    );
  }

  // tslint:disable-next-line:typedef
  private setToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
