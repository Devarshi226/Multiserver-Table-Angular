import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private httpClient:HttpClient) { }

  getUser(){
    return this.httpClient.get("https://664d9430ede9a2b55653fabe.mockapi.io/api/Database1");
  }

  addUser(data:any){
    return this.httpClient.post("https://664d9430ede9a2b55653fabe.mockapi.io/api/Database1",data);
  }

  addData(data:any){
    return this.httpClient.post("https://664d9430ede9a2b55653fabe.mockapi.io/api/database2",data);
  }

  deleteUser(id: any) {
    return this.httpClient.delete(`https://664d9430ede9a2b55653fabe.mockapi.io/api/Database1/${id}`);
  }
  updateUser(id: any, user: any) {
    return this.httpClient.put(`https://664d9430ede9a2b55653fabe.mockapi.io/api/Database1/${id}`, user);
  }

  deleteUser1(id: any) {
    return this.httpClient.delete(`https://664d9430ede9a2b55653fabe.mockapi.io/api/database2/${id}`);
  }
  updateUser1(id: any, user: any) {
    return this.httpClient.put(`https://664d9430ede9a2b55653fabe.mockapi.io/api/database2/${id}`, user);
  }
}
