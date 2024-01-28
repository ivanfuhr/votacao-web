// loading.service.ts
import { BehaviorSubject, Observable } from 'rxjs';

export class LoadingService {
  private static loadingSubject = new BehaviorSubject<boolean>(false);

  public static setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  public static isLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}
