// BackendService.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
 private baseUrl = 'https://crudrapido-app-latest.onrender.com'; // URL de tu backend Spring Boot
//private baseUrl = 'http://localhost:8080'; // URL de tu backend Spring Boot

  constructor(private http: HttpClient) {}


  // Aqui usamos los endpoint de estudiante controller  -------------------------


  // enviar estudiante en forma de json al backend
 enviarEstudianteAlBackend(dato: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/estudiantes/guardarEstudiante`, dato, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
    });
  }

  // Método para obtener todos lo usuarios con caché
  private estudiantesCache: any[] = [];
  private cacheTimestamp: number = 0;
  private cacheDuration: number = 30000; // 30 segundos

  getDatosTOdosUsuarios(forceRefresh: boolean = false): Observable<any[]> {
    const now = Date.now();
    
    // Retornar caché si está disponible y no está expirado
    if (!forceRefresh && this.estudiantesCache && (now - this.cacheTimestamp) < this.cacheDuration) {
      return new Observable(observer => {
        observer.next(this.estudiantesCache);
        observer.complete();
      });
    }

    // Hacer petición y actualizar caché
    return this.http.get<any[]>(`${this.baseUrl}/api/estudiantes/obtenerEstudiantes`).pipe(
      retry(2), // Reintentar 2 veces en caso de error
      tap((data: any[]) => {
        this.estudiantesCache = data;
        this.cacheTimestamp = now;
      }),
      catchError(this.handleError)
    );
  }

  // Manejo de errores mejorado
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 0:
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Solicitud inválida. Verifica los datos enviados.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
          break;
        default:
          errorMessage = error.error?.message || `Error ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => ({ message: errorMessage, status: error.status }));
  }

  // Limpiar caché
  clearCache(): void {
    this.estudiantesCache = [];
    this.cacheTimestamp = 0;
  }


getEstudiante(idEstudiante: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/api/estudiantes/obtenerEstudiante/${idEstudiante}`).pipe(
    retry(1),
    catchError(this.handleError)
  );
}

deleteEstudiante(idEstudiante: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/api/estudiantes/${idEstudiante}`).pipe(
    tap(() => {
      // Limpiar caché después de eliminar
      this.clearCache();
    })
  );
}

actualizarEstudiante(idEstudiante: string, estudiante: any): Observable<any> {
  // Enviamos el id y el cuerpo con los datos del estudiante
  return this.http.put(`${this.baseUrl}/api/estudiantes/actualizarEstudiante/${idEstudiante}`, estudiante).pipe(
    tap(() => {
      // Limpiar caché después de actualizar
      this.clearCache();
    }),
    catchError(this.handleError)
  );
}



  eliminarEstudiante(id: string ): string {
    return "hola";

  }


  editarEstudiante (id: string ):  string  {
    return "hola";

  }


  //-------------------------------------------------------------------------------------------









}
