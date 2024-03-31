import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {

  url = environment.BASE_URL_CLIENT;

  constructor(
    private http: HttpClient
  ) { }

  getServerStatus() {
    return this.http.get(`${this.url}/status`)
  }

  getGreeting(name?: String) {
    return this.http.post(`${this.url}/greeting`, name ? { name } :  {})
  }

  encodeMessage(message: String) {
    return this.http.post(`${this.url}/encrypt-message`, { message })
  }

  decodeMessage(data: {encrypted_message: String, iv: String}) {
    return this.http.post(`${this.url}/decrypt-message`, { encrypted_message: data.encrypted_message, iv: data.iv })
  }
}
