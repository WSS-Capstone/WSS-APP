import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ApiOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };

  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  reuqest(req: HttpRequest<any>) {
    return this.http.request(req);
  }

  get<T>(path: string, options?: ApiOptions) {
    return this.http.get<T>(path, {
      responseType: 'json',
      withCredentials: true,
      ...options,
    });
  }

  post<T>(path: string, body: any | null, options?: ApiOptions): Observable<T> {
    return this.http.post<T>(path, body, {
      responseType: 'json',
      withCredentials: true,
      ...options,
    });
  }

  put<T>(path: string, body: any | null, options?: ApiOptions): Observable<T> {
    return this.http.put<T>(path, body, {
      withCredentials: true,
      responseType: 'json',
      ...options,
    });
  }

  patch<T>(
    path: string,
    body: any | null,
    options?: ApiOptions,
  ): Observable<T> {
    return this.http.patch<T>(path, body, {
      withCredentials: true,
      responseType: 'json',
      ...options,
    });
  }

  delete<T>(path: string, options?: ApiOptions): Observable<T> {
    return this.http.delete<T>(path, {
      withCredentials: true,
      responseType: 'json',
      ...options,
    });
  }
}
