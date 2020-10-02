import { BehaviorSubject } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  msgIncoming;

  constructor(
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private socket: Socket
  ) { }

  setupSocket(id) {
    this.msgIncoming = this.socket.fromEvent(id);
  }

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

  sendMessage(Msg) {
    this.socket.emit('sendMessage', JSON.stringify(Msg));
  }

  deleteMsg(Msg, roomId, receiver) {
    this.socket.emit('deleteMessage', JSON.stringify({
      Msg,
      roomId,
      receiver
    }));
  }
}
