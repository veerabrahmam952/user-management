
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://microsoftedge.github.io/Demos/json-dummy-data/64KB.json';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  loadUsers(): void {
    this.fetchUsers().subscribe(users => {
      this.usersSubject.next(users);
    });
  }

  getUsers(): User[] {
    return this.usersSubject.value;
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find(user => user['id'] === id);
  }

  updateUser(updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex(user => user['id'] === updatedUser['id']);
    if (index !== -1) {
      users[index] = updatedUser;
      this.usersSubject.next([...users]);
    }
  }
}
