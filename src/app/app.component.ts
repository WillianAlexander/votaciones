import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReCaptchaV3Service } from 'ng-recaptcha';

export interface Socio {
  ESTADO: boolean;
  CEDULA: string;
  NOMBRE: string;
  RECINTO: string;
  JUNTA: number | string;
  DIRECCION: string;
  PROVINCIA: string;
  CANTON: string;
  [key: string]: unknown;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  cedula = '';
  showResult = false;
  inputError: string | null = null;
  loading = false;

  result: any = {};

  constructor(private recaptchaV3: ReCaptchaV3Service) {}

  consultar(cedula: string): void {
    if (!cedula || cedula.trim() === '') {
      this.inputError = 'Por favor ingrese un número de cédula válido.';
      return;
    }

    this.inputError = null;
    this.loading = true;
    this.recaptchaV3.execute('consulta').subscribe({
      next: async (token) => {
        this.loading = false;

        const response = fetch('http://192.168.112.131:3000/socios/consulta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cedula: cedula.trim(), token: token }),
        })
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then((data) => {
            return data;
          })
          .catch((err) => {
            return null;
          });

        const socio = (await response) as Socio;

        if (!socio.ESTADO) {
          this.inputError = 'Socio no encontrado';
          return;
        }

        this.cedula = cedula;

        this.result = {
          nombre: socio.NOMBRE,
          cedula: socio.CEDULA,
          recinto: socio.RECINTO,
          junta: String(socio.JUNTA),
          direccion: socio.DIRECCION,
          provincia: socio.PROVINCIA,
          canton: socio.CANTON,
        };
        this.showResult = true;
      },
      error: () => {
        this.loading = false;
        this.inputError = 'Error al verificar reCAPTCHA. Intente nuevamente';
      },
    });
  }

  nuevaConsulta(): void {
    this.showResult = false;
    this.cedula = '';
    this.inputError = null;
  }
}
