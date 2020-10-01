import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  showAlert(msg, action) {
    this._snackBar.open(msg, action);
  }

  getUsers() {
    const getUsersURL = environment.URL + 'api/chat/syncMessages';
    return this.http.get(getUsersURL);
  }

  createOpenRoom(receiverId) {
    const createOpenRoomURL = environment.URL + 'api/chat/createRoom';
    return this.http.post(createOpenRoomURL, {
      receiverId
    });
  }
}
