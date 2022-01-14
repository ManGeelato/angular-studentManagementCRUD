import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';


const baseUrl = 'http://localhost:3000/posts/';
@Injectable({
  providedIn: 'root'
})
export class StudentApiService {

  constructor(private http: HttpClient) { }

  onPost(data:any){
    return this.http.post<any>(baseUrl, data).pipe(map((res:any)=>{
      return res;
    }))
  }

  onGet(){
    return this.http.get<any>(baseUrl).pipe(map((res:any)=>{
      return res;
    }))
  }

  onUpdate(data:any, id:number){
    return this.http.put<any>(baseUrl +id, data).pipe(map((res:any)=>{
      return res;
    }))
  }

  onDelete(id:number){
    return this.http.delete<any>(baseUrl +id).pipe(map((res:any)=>{
      return res;
    }))
  }




}
