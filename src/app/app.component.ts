import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientServiceService } from './services/client-service.service';

export interface PeriodicElement {
  name: string;
  response: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {name: "estatus", response: ''},
  {name: "saludo", response: "hi"},
  {name: "encriptar mensaje", response: "hi"},
  {name: "desencriptar mensaje", response: "hi"},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  greetingForm: FormGroup;
  encodeMessageForm: FormGroup;
  decodeMessageForm: FormGroup;

  statusValue = 'Revisa el estatus del servidor'
  saludoValue = 'Envia tu nombre para saludarte'
  encodeValue = 'Encriptamos tu mensaje, ¿quieres probarlo?'
  decodeValue = 'Desencriptamos tus mensaje, pruebalo ahora!'

  constructor(
    private fb: FormBuilder,
    private clientService: ClientServiceService
  ) {
    this.loadForms()
  }

  loadForms() {
    this.greetingForm = this.fb.group({
      name: ['', [Validators.pattern('[a-zA-Z ]*')]]
    });

    this.encodeMessageForm = this.fb.group({
      message: ['', [Validators.required]]
    })

    
    this.decodeMessageForm = this.fb.group({
      encrypted_message: ['', [Validators.required]],
      iv: ['', [Validators.required]]
    })
  }

  async getGreeting() {
    this.clientService.getGreeting(this.greetingForm.value.name).subscribe(
      (res: any) => {
        this.saludoValue = res.message
      }
    )
  }

  async getServerStatus() {
    this.clientService.getServerStatus().subscribe(
      (res: any) => {
        this.statusValue = `El estado del servidor es ${res.status}`
      }
    )
  }

  async encodeMessage() {
    if (this.encodeMessageForm.invalid) {
      return Object.values(this.encodeMessageForm.controls).forEach(control => {
        control.markAsTouched();
      })
    }

    this.clientService.encodeMessage(this.encodeMessageForm.value.message).subscribe(
      (res: any) => {
        console.log(res);
        this.encodeValue = `Su mensaje encriptado es ${res.encrypted_message}, ten a la mano el siguiente iv: ${res.iv}, para desencriptarlo`
      }
    )
  }

  async decodeMessage() {
    if (this.decodeMessageForm.invalid) {
      return Object.values(this.decodeMessageForm.controls).forEach(control => {
        control.markAsTouched();
      })
    }
    
    this.clientService.decodeMessage(
      {
        encrypted_message: this.decodeMessageForm.value.encrypted_message, 
        iv: this.decodeMessageForm.value.iv
      }).subscribe(
        (res: any) => {
          if (res.error) {
            this.decodeValue = res.error
          } else {
            this.decodeValue = `Su mensaje desencriptado es: ${res.decrypted_message}`
          }
        }
      )
  }

  displayedColumns: string[] = ['name', 'response'];
  dataSource = ELEMENT_DATA;
  
  title = 'client';
}
