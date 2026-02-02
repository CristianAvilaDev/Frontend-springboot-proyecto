import { Component, Input } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-usuario',
  standalone: false,
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {
   isEditing = false;
  estudiante: any;  // Para almacenar los detalles del estudiante
  estudianteId: string | null = '';
  isLoading: boolean = false;
  isSaving: boolean = false;
  isDeleting: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private backendService: BackendService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el ID del estudiante desde la URL
    this.estudianteId = this.route.snapshot.paramMap.get('id');
    console.log('Estudiante ID:', this.estudianteId);

    // Llamar al servicio para obtener los detalles del estudiante
    if (this.estudianteId) {
      this.isLoading = true;
      this.backendService.getEstudiante(this.estudianteId).subscribe({
        next: (response) => {
          this.estudiante = response;
          console.log('Detalles del estudiante:', this.estudiante);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al obtener el estudiante:', error);
          this.isLoading = false;
          const errorMessage = error?.message || 'Error al cargar los datos del estudiante.';
          this.notificationService.showError(errorMessage);
          // Redirigir a la lista después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/lista_estudiantes']);
          }, 2000);
        }
      });
    }
  }


  // Método para abrir el modal
  openModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  // Método para cerrar el modal
  closeModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  borrarEstudiante(estudiante: any) {
    if (this.estudianteId) {
      this.isDeleting = true;
      this.backendService.deleteEstudiante(this.estudianteId).subscribe({
        next: (response) => {
          console.log("estudiante borrado");
          // Mantener isDeleting = true para que el modal muestre el color rojo
          this.notificationService.showSuccess('Estudiante eliminado exitosamente');
          this.openModal();
        },
        error: (error) => {
          console.error("error al borrar", error);
          this.isDeleting = false;
          const errorMessage = error?.message || 'Error al eliminar el estudiante. Por favor, intenta nuevamente.';
          this.notificationService.showError(errorMessage);
        }
      });
    }
  }

  // Método para cerrar el modal y redirigir a la lista de estudiantes
  closeModalAndRedirect(): void {
    this.closeModal();
    // Redirigir a la lista de estudiantes después de cerrar el modal
    this.router.navigate(['/lista_estudiantes']);
    // Resetear isDeleting después de redirigir
    this.isDeleting = false;
  }

  editarEstudiante(estudiante: any) {



    this.isEditing = true;
  }
  guardarCambios(estudiante: any) {
    if (this.estudianteId) {
      this.isSaving = true;
      // Enviamos tanto el id como los datos completos del estudiante
      this.backendService.actualizarEstudiante(this.estudianteId, estudiante).subscribe({
        next: (response) => {
          console.log("Estudiante actualizado", response);
          this.isSaving = false;
          this.isEditing = false;
          this.notificationService.showSuccess('Estudiante actualizado exitosamente');
          this.openModal();
          // No recargar datos automáticamente para evitar llamadas innecesarias a la BD
          // El usuario puede volver a la lista de estudiantes si necesita ver los cambios
        },
        error: (error) => {
          console.error("Error al actualizar", error);
          this.isSaving = false;
          const errorMessage = error?.message || 'Error al actualizar el estudiante. Por favor, intenta nuevamente.';
          this.notificationService.showError(errorMessage);
        }
      });
    } else {
      this.isEditing = false;
    }
  }





}
