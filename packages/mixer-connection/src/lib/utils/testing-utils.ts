import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

export function readFirst<T>(o: Observable<T>): Promise<T> {
  return o.pipe(first()).toPromise();
}
