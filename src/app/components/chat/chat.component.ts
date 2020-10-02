import { interval } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

  @ViewChild('chatBox') chatBox; 

  TOKEN_KEY = 'auth-token';
  myDetails = JSON.parse(localStorage.getItem(this.TOKEN_KEY));
  msg = null;
  roomId = null;
  
  onlineFlag = false;
  onlineSub;

  selectedUser = null
  msgIncomingSub;

  users = JSON.parse(localStorage.getItem('users'));

  constructor(
    private dataS: DataService,
    private _snackBar: MatSnackBar,
  ) {

    this.onlineSub = interval(1000)
                      .subscribe(() => {
                        if(this.selectedUser != null) {
                          this.onlineFlag = false;
                          this.dataS.onlineStatusReq(this.myDetails.id, this.selectedUser._id);
                        }
                      });

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
        // console.log(this.users);
      });
    
    this.msgIncomingSub = this.dataS.msgIncoming.subscribe(msg => {
      msg = JSON.parse(msg);
      // console.log(msg);
      if(msg.onlineStatusReq == true) {
        this.dataS.onlineStatusRes(msg.sender);
        return;
      }
      if(msg.onlineStatusRes == true) {
        this.onlineFlag = true;
        return;
      }
      if(msg.delete == true) {
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

    this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
  }

  openChat(user) {
    this.onlineFlag = false;
    this.dataS.createOpenRoom(user._id)
      .subscribe(res => {
        // console.log(res);
        this.roomId = res['roomId'];
        this.selectedUser = user;
        this.selectedUser.newMessages = 0;
        this.dataS.onlineStatusReq(this.myDetails.id, this.selectedUser._id);
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
      // console.log('The snack-bar action was triggered!');
      this.selectedUser.messages = this.selectedUser.messages.filter(m => m.timeStamp != Msg.timeStamp);
      this.dataS.deleteMsg(Msg, roomId, receiver);
      return true;
    });
  }

  convertDate(date) {
    return new Date(date);
  }

  showEmojiPicker = false;
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  set = 'apple';
  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
        this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event) {
    console.log(event)
    this.msg = (this.msg != null) ? this.msg + event.emoji.native : event.emoji.native;
    console.log(this.msg);
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.msgIncomingSub.unsubscribe();
    this.onlineSub.unsubscribe();
  }

}
