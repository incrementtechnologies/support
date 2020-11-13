<template>
<div class="holder">
 <table class="table " id="myIssues">
  <thead>
   <tr class="d-flex border">
      <th class="col-2"
        id="typeBtn"
        v-for="(ticket,index) in tickets" :key="index" 
        :class="{'active':(ticket === currentTicket)}"
        @click="activate($event, ticket)"
      >
          <svg v-if="ticket.type == 'open'" height="16" class="octicon octicon-issue-opened" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path></svg>    
          <svg v-if="ticket.type == 'pending'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><path d="M16 6h-6l2.243-2.243C11.11 2.624 9.603 2 8 2s-3.109.624-4.243 1.757C2.624 4.89 2 6.397 2 8s.624 3.109 1.757 4.243C4.89 13.376 6.397 14 8 14a5.963 5.963 0 0 0 4.516-2.049l1.505 1.317a8 8 0 1 1-.364-10.924L16 0v6z" fill="#626262"/></svg>
          <svg v-if="ticket.type == 'closed'" height="16" class="octicon octicon-issue-closed" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 0110.65-5.003.75.75 0 00.959-1.153 8 8 0 102.592 8.33.75.75 0 10-1.444-.407A6.5 6.5 0 011.5 8zM8 12a1 1 0 100-2 1 1 0 000 2zm0-8a.75.75 0 01.75.75v3.5a.75.75 0 11-1.5 0v-3.5A.75.75 0 018 4zm4.78 4.28l3-3a.75.75 0 00-1.06-1.06l-2.47 2.47-.97-.97a.749.749 0 10-1.06 1.06l1.5 1.5a.75.75 0 001.06 0z"></path></svg>
          <span id="type">{{ticket.value != null ? ticket.value: 0}} {{ticket.type}}</span>
   
      </th>
      <th class="col float-right" >
        <span class="float-right">
          Actions   
        </span>
      </th>
   </tr>
  </thead>
    <tbody>
      <tr class="d-flex border" v-for="(item, index) in data" :key="index">
          <td class="col-9">
            <div class="d-flex">
              <svg v-if="currentTicket.type == 'open'" height="16" class="octicon octicon-issue-opened" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z" style="fill:green"></path></svg>    
              <svg v-if="currentTicket.type == 'pending'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><path d="M16 6h-6l2.243-2.243C11.11 2.624 9.603 2 8 2s-3.109.624-4.243 1.757C2.624 4.89 2 6.397 2 8s.624 3.109 1.757 4.243C4.89 13.376 6.397 14 8 14a5.963 5.963 0 0 0 4.516-2.049l1.505 1.317a8 8 0 1 1-.364-10.924L16 0v6z" style="fill:orange"/></svg>
              <svg v-if="currentTicket.type == 'closed'" height="16" class="octicon octicon-issue-closed" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 0110.65-5.003.75.75 0 00.959-1.153 8 8 0 102.592 8.33.75.75 0 10-1.444-.407A6.5 6.5 0 011.5 8zM8 12a1 1 0 100-2 1 1 0 000 2zm0-8a.75.75 0 01.75.75v3.5a.75.75 0 11-1.5 0v-3.5A.75.75 0 018 4zm4.78 4.28l3-3a.75.75 0 00-1.06-1.06l-2.47 2.47-.97-.97a.749.749 0 10-1.06 1.06l1.5 1.5a.75.75 0 001.06 0z" style="fill:red"></path></svg>         
              <div>
                <span>
                  <b>{{ item.content[0] == '{' ? JSON.parse(item.content).title : item.content}} </b>#{{item.id}}
                </span>
                
                <button 
                  disabled
                  :style="{backgroundColor: ticketTypeBackgroundColor(item.type), color: ticketTypeColor(item.type)}"
                  >{{item.type}}
                </button>
                <br>
                <span v-if="currentTicket.type == 'open'">opened by {{item.account_id}} {{getticketTimePassed(item.created_at) + ' ago'}}</span>
                <span v-if="currentTicket.type == 'pending'">{{item.assigned_to  != null ? 'assigned to ' + item.assigned_to : 'not yet assigned'}}</span>
                <span v-if="currentTicket.type == 'closed'">closed {{getticketTimePassed(item.updated_at) + ' ago'}}</span>
              </div>
            </div>
          </td>
          <td class="col-3">
            <div class="dropdown" >
                <span  class="float-right" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                  <i class="fas fa-ellipsis-h"></i>
                </span>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" @click="retrieveItems(item)"><i class="fas fa-eye"></i> Show Details</a>                  
                  <a class="dropdown-item" @click="showMessage(item, index)"><i class="far fa-comment-alt"></i> Message </a>
                  <a class="dropdown-item" v-if="user.type !== 'ADMIN' && item.account_id === user.userID" @click="showdeleteModal(item)">
                    <svg  height="16" class="octicon octicon-issue-closed" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 0110.65-5.003.75.75 0 00.959-1.153 8 8 0 102.592 8.33.75.75 0 10-1.444-.407A6.5 6.5 0 011.5 8zM8 12a1 1 0 100-2 1 1 0 000 2zm0-8a.75.75 0 01.75.75v3.5a.75.75 0 11-1.5 0v-3.5A.75.75 0 018 4zm4.78 4.28l3-3a.75.75 0 00-1.06-1.06l-2.47 2.47-.97-.97a.749.749 0 10-1.06 1.06l1.5 1.5a.75.75 0 001.06 0z"></path></svg>
                    Close
                  </a>
                </div>
              </div>
          </td>
      </tr>
    </tbody>
  </table>
  <confirmation ref="confirmation" @onConfirm="deleteItem" title='Delete' message='Are you sure you want to delete Ticket'/>
</div>
</template>

<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import TimeInterval from './TimeInterval.js'
import TicketType from './TicketTypes.js'
export default {
  name: 'ticket-table',
  created(){
    this.currentTicket = this.tickets[0]
    this.data = this.ticketData
  },
  components: {
    'confirmation': require('components/increment/generic/modal/Confirmation.vue')
  },
  data(){
    // connectionError
    return {
      user: AUTH.user,
      data: null,
      tickets: [{
        type: 'open',
        value: null
      }, {
        type: 'pending',
        value: null
      }, {
        type: 'closed',
        value: null
      }],
      currentTicket: null,
      timeInterval: TimeInterval,
      ticketType: TicketType.types
    }
  },
  props: [
    'ticketData'
  ],
  watch: {
    ticketData: {
      handler(newValue, oldValue) {
        this.data = newValue
      }
    }
  },
  methods: {
    ticketTypeBackgroundColor(item) {
      var color = ''
      this.ticketType.forEach(element => {
        if(item === element.type){
          color = element.color
        }
      })
      return color
    },
    ticketTypeColor(item) {
      var color = ''
      this.ticketType.forEach(element => {
        if(item === element.type){
          color = element.textColor
        }
      })
      return color
    },
    activate(event, ticket) {
      this.data = null
      this.currentTicket = ticket
      this.$parent.statusType = this.currentTicket.type
      this.$parent.retrieve()
    },
    retrieveItems(item){
      ROUTER.push('/tickets/details/' + item.id)
    },
    showMessage(item, index){
      this.$parent.showMessage(item, index)
    },
    showdeleteModal(item){
      this.$refs.confirmation.show(item)
    },
    deleteItem(event){
      this.closeTicket(event.id)
      // this.APIRequest('tickets/delete', parameter).then(response => {
      //   this.$parent.retrieve()
      // })
    },
    closeTicket(item) {
      console.log(item)
      this.APIRequest('tickets/update ', item).then(response => {
        this.$parent.retrieve()
      })
    },
    getticketTimePassed(time){
      var ticketCreation = new Date(time)
      var current = new Date()
      var difference = (current - ticketCreation)
      let result = this.timeInterval.getticketTimePassed(difference)
      let timePassedFormat = ''
      if(result.length === 1) {
        timePassedFormat += result[0].interval + ' ' + result[0].unit + (result[0].interval > 1 ? 's' : '')
        return timePassedFormat
      }
      if(result.length === 2) {
        timePassedFormat += result[0].interval + ' ' + result[0].unit + result[0].unit > 1 ? 's' : ''
        timePassedFormat += 'and' + ' ' + result[1].interval + ' ' + result[1].unit + result[1].unit > 1 ? 's' : ''
        return timePassedFormat
      }
      result.forEach(el => {
        if(result.indexOf(el) === 0) {
          timePassedFormat += el.interval + ' ' + el.unit + el.unit > 1 ? 's' : ''
        }
        if(result.indexOf(el) === result.length - 1) {
          timePassedFormat += 'and' + ' ' + el.interval + ' ' + el.unit + el.unit > 1 ? 's' : ''
        }
        timePassedFormat += ',' + ' ' + el.interval + ' ' + el.unit + el.unit > 1 ? 's' : ''
      })
      return timePassedFormat
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~assets/style/colors.scss";
.holder{    
  width: 100%;
}
#myIssues {
    width: 100%;
}
#myIssues thead:first-child th {
  font-weight: normal;
  cursor: pointer;
}

// #typeBtn:hover {
//   font-weight:500 !important;
//   border-bottom: solid red 1px;
// }
#typeBtn.active {
  font-weight:500 !important;
  border-bottom: solid $primary 1px;
}
// th {
//   position: relative;
//   height: 50px;
// }
#myIssues thead:first-child th:first-child span{
  margin-right: 20px;
}
#myIssues thead:first-child th:first-child span svg{
  margin-right: 5px;
}

svg{
  margin-top: 5px;
  margin-right: 10px;
}
#myIssues tbody tr, thead tr{
  border-radius: 10px;
}
#myIssues tbody tr { 
    min-height: 70px;
    margin-top: 10px;
  }
#myIssues tbody tr td div span {
  margin-right: 10px;
}

#myIssues tbody tr td div button{
  border-radius: 20px;
  height: 25px;
  min-width: 60px;
  border:0;
}

</style>
