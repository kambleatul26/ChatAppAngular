import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

  TOKEN_KEY = 'auth-token';
  myDetails = JSON.parse(localStorage.getItem(this.TOKEN_KEY));
  msg = null;
  roomId = null;

  // selectedUser = {
  //   _id: '5f75b47fc8a3c5321e0516ed',
  //   name: 'Shubham',
  //   messages: [
  //     {
  //       sender: '5f743d9d92eb67a59f7fe9fc',
  //       message: 'Hii Mann',
  //       timeStamp: new Date()
  //     },
  //     {
  //       sender: '5f743d9d92eb67a59f7fe9fc',
  //       message: 'Where are you',
  //       timeStamp: new Date()
  //     },
  //     {
  //       sender: '5f75b47fc8a3c5321e0516ed',
  //       message: 'Reaching in 5',
  //       timeStamp: new Date()
  //     }
  //   ],
  //   newMessages: 2
  // }

  selectedUser = null

  users = JSON.parse(localStorage.getItem('users'));

  constructor(
    private dataS: DataService,
    private _snackBar: MatSnackBar,
  ) {
    this.dataS.getUsers()
      .subscribe(res => {
        res['users'].forEach(val => {
          if(this.users != null) {
            let user = this.users.find(u => val._id == u._id);
            // console.log(user);
            if(user == null) {
              val.newMessages = val.messages.length;
            } else if(user.messages.length < val.messages.length) {
              val.newMessages = val.messages.length - user.messages.length;
            } else {
              val.newMessages = 0;
            }  
          }
        });
        this.users = res['users'];
        localStorage.setItem('users', JSON.stringify(this.users));
        console.log(this.users);
      });

    // this.dataS.getMsgIncoming()
    //   .subscribe(msg => {
    //     console.log(msg);
    //     if(msg != null) {
    //       let index = this.users.findIndex(u => u._id == msg.sender);
    //       this.users[index].messages.push(msg);  
    //     }
    //   })
    
    this.dataS.msgIncoming.subscribe(msg => {
      msg = JSON.parse(msg);
      console.log(msg);
      if(msg.delete == true) {
        console.log('H')
        let index = this.users.findIndex(u => u._id == msg.Msg.sender);
        this.users[index].messages = this.users[index].messages.filter(m => msg.Msg.timeStamp != m.timeStamp);
        return;
      }
      if(msg != null) {
        let index = this.users.findIndex(u => u._id == msg.sender);
        this.users[index].messages.push(msg);
        this.users[index].newMessages++;
        return;
      }
    })
  }

  sendMsg() {
    if(this.msg == null || this.msg == '') return;
    let Msg = {
      sender: this.myDetails.id,
      timeStamp: new Date(),
      message: this.msg,
      roomId: this.roomId,
      receiver: this.selectedUser._id
    };
    this.dataS.sendMessage(Msg);
    this.selectedUser.messages.push({
      sender: Msg.sender,
      timeStamp: Msg.timeStamp,
      message: Msg.message,
    });
    this.msg = null;
  }

  openChat(user) {
    this.dataS.createOpenRoom(user._id)
      .subscribe(res => {
        console.log(res);
        this.roomId = res['roomId'];
        console.log(this.roomId);
        this.selectedUser = user;
        this.selectedUser.newMessages = 0;
      }, err => {
        console.log(err);
      })
  }

  deleteMsg(Msg) {
    this.deleteAlert('Press Confirm to delete', 'Confirm', Msg, this.roomId, this.selectedUser._id);
  }

  deleteAlert(message, action, Msg, roomId, receiver) {
    let sb = this._snackBar.open(message, action, {
      duration: 4000
    });

    sb.onAction().subscribe(() => {
      console.log('The snack-bar action was triggered!');
      this.selectedUser.messages = this.selectedUser.messages.filter(m => m.timeStamp != Msg.timeStamp);
      this.dataS.deleteMsg(Msg, roomId, receiver);
      return true;
    });
  }

  convertDate(date) {
    return new Date(date);
  }

  ngOnInit(): void {
  }

}
