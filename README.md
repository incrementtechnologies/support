# Welcome to Increment Support Plugin using Vuejs

This requires pusher on laravel, kindly check the installation on pusher using vuejs.

On you index.js file under services/auth add the following line of codes.
Import
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

# Declare
```javascript
support: {
  messages: null,
  badge: 0,
  messengerGroupId: null
}
```

# Add function
```javascript
  connect(){
    if(!this.echo){
      this.echo = new Echo({
        broadcaster: 'pusher',
        key: '',
        cluster: 'ap1',
        encrypted: true,
        auth: {
          headers: {
            Authorization: 'Bearer' + this.tokenData.token
          }
        }
      })
      $.ajaxSetup({
        beforeSend: function() {}
      })
    }
    this.echo.channel('idfactory').listen('Message', (response) => {
      if(parseInt(response.message.account_id) !== this.user.userID && response.message.status === 'support'){
        this.playNotificationSound()
        if(this.support.messengerGroupId !== parseInt(response.message.messenger_group_id) && this.support.messengerGroupId !== null){
          this.support.badge++
        }
        if(!this.support.messages){
          this.support.messages = []
          this.support.messages.push(response.message)
        }else{
          if(this.support.messengerGroupId === parseInt(response.message.messenger_group_id)){
            this.support.messages.push(response.message)
          }
        }
      }else if(parseInt(response.message.account_id) !== this.user.userID && response.message.status !== 'support'){
        this.playNotificationSound()
        if(this.messenger.messengerGroupId !== parseInt(response.message.messenger_group_id) && this.messenger.messengerGroupId !== null){
          this.messenger.badge++
        }
        if(!this.messenger.messages){
          this.messenger.messages = []
          this.messenger.messages.push(response.message)
        }else{
          if(this.messenger.messengerGroupId === parseInt(response.message.messenger_group_id)){
            this.messenger.messages.push(response.message)
          }
        }
      }
    })
  }
  ```
  Call connect() method right after authentication or reauthentication
  
