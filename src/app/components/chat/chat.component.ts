import { DataService } from 'src/app/services/data.service';
import { Component, Directive, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickHandler]'
})
export class ClickHandlerDirective {

   @HostListener('click', ['$event']) log(e){
    console.log(e)
  }
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

  TOKEN_KEY = 'auth-token';
  myDetails = JSON.parse(localStorage.getItem(this.TOKEN_KEY));
  msg = null;

  selectedUser = {
    _id: '5f75b47fc8a3c5321e0516ed',
    name: 'Shubham',
    messages: [
      {
        sender: '5f743d9d92eb67a59f7fe9fc',
        message: 'Hii Mann',
        timeStamp: new Date()
      },
      {
        sender: '5f743d9d92eb67a59f7fe9fc',
        message: 'Where are you',
        timeStamp: new Date()
      },
      {
        sender: '5f75b47fc8a3c5321e0516ed',
        message: 'Reaching in 5',
        timeStamp: new Date()
      }
    ],
    newMessages: 2
  }

  users = [
    {
      _id: '5f75b47fc8a3c5321e0516ed',
      name: 'Shubham',
      messages: [],
      newMessages: 5,
      isManager: false
    }
  ]

  constructor(private dataS: DataService) {
    this.dataS.getUsers()
      .subscribe(res => {
        res['users'].forEach(val => {
          let user = this.users.find(u => val._id == u._id);
          // console.log(user);
          if(user == null) {
            val.newMessages = val.messages.length;
          } else if(user.messages.length < val.messages.length) {
            val.newMessages = val.messages.length - user.messages.length;
          } else {
            val.newMessages = 0;
          }
        });
        this.users = res['users'];
        console.log(this.users);
      });
  }

  sendMsg() {
    
  }

  openChat(user) {
    this.dataS.createOpenRoom(user._id)
      .subscribe(res => {
        console.log(res);
        this.selectedUser = user;
      }, err => {
        console.log(err);
      })
  }

  ngOnInit(): void {
  }

}
