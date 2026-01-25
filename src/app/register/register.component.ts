import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // Variables para el formulario
  formFirstName: string = '';
  formLastName: string = '';
  formEmail: string = '';
  password: string = '';
  
  // Variables para validación y estado
  isSubmitting: boolean = false;
  errors: any = {
    firstName: '',
    email: ''
  };
  emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private backendService: BackendService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

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

  // Validar campo en tiempo real
  validateField(fieldName: string): void {
    switch(fieldName) {
      case 'firstName':
        if (!this.formFirstName.trim()) {
          this.errors.firstName = 'El primer nombre es requerido';
        } else if (this.formFirstName.trim().length < 2) {
          this.errors.firstName = 'El nombre debe tener al menos 2 caracteres';
        } else {
          this.errors.firstName = '';
        }
        break;
      case 'email':
        if (!this.formEmail.trim()) {
          this.errors.email = 'El correo electrónico es requerido';
        } else if (!this.emailPattern.test(this.formEmail)) {
          this.errors.email = 'Ingresa un correo electrónico válido';
        } else {
          this.errors.email = '';
        }
        break;
    }
  }

  // Validar todo el formulario
  validateForm(): boolean {
    let isValid = true;
    
    if (!this.formFirstName.trim()) {
      this.errors.firstName = 'El primer nombre es requerido';
      isValid = false;
    } else if (this.formFirstName.trim().length < 2) {
      this.errors.firstName = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    } else {
      this.errors.firstName = '';
    }
    
    if (!this.formEmail.trim()) {
      this.errors.email = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!this.emailPattern.test(this.formEmail)) {
      this.errors.email = 'Ingresa un correo electrónico válido';
      isValid = false;
    } else {
      this.errors.email = '';
    }
    
    return isValid;
  }

  // Método para manejar el envío del formulario y enviar los datos al backend
  onSubmit(): void {
    // Validar antes de enviar
    if (!this.validateForm()) {
      return;
    }

    if (this.isSubmitting) {
      return; // Evitar múltiples envíos
    }

    this.isSubmitting = true;
    
    const datos = {
      firstName: this.formFirstName.trim(),
      lastName: this.formLastName.trim(),
      email: this.formEmail.trim(),
      password: this.password
    };

    this.backendService.enviarEstudianteAlBackend(datos).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        this.isSubmitting = false;
        this.openModal();
        // Limpiar caché para forzar la actualización de datos
        this.backendService.clearCache();
        // No limpiar formulario después del éxito para que el modal muestre los datos
        // this.formFirstName = '';
        // this.formLastName = '';
        // this.formEmail = '';
        // this.password = '';
        this.errors = { firstName: '', email: '' };
      },
      error: (error) => {
        console.error('Error al enviar los datos:', error);
        this.isSubmitting = false;
        // Mostrar error al usuario
        this.notificationService.showError('Error al registrar estudiante. Por favor, intenta nuevamente.');
      }
    });
  }

  // Método para cerrar el modal y redirigir a la lista de estudiantes
  closeModalAndRedirect(): void {
    this.closeModal();
    // Limpiar caché para forzar la recarga de datos
    this.backendService.clearCache();
    // Redirigir a la lista de estudiantes
    this.router.navigate(['/list-estudiantes']);
  }


  ngOnInit(): void {}
}
