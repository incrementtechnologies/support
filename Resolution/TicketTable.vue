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
        <span id="type">{{ticket.status}}</span>

      </th>
   </tr>
  </thead>
    <tbody>
      <tr class="d-flex border" v-for="(item, index) in data" :key="index">
          <td class="col-9"  @click="retrieveItems(item)" style="cursor:pointer;">
            <div class="d-flex">
              <div>
                <span>
                  #{{item.id}} <b>{{ item.title }}</b>
                  <!-- <b>{{ item.content[0] == '{' ? JSON.parse(item.content).title : item.content}} </b>#{{item.id}} -->
                </span>

                <button
                  disabled
                  :style="{backgroundColor: ticketTypeBackgroundColor(item.type), color: ticketTypeColor(item.type)}"
                  >{{item.type}}
                </button>
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
  mounted(){
    this.data = this.ticketData
    console.log(this.currentTicket, '---------------')
  },
  data(){
    return {
      user: AUTH.user,
      data: null,
      tickets: [{
        status: 'PENDING',
        value: null
      }, {
        status: 'OPEN',
        value: null
      }, {
        status: 'CLOSED',
        value: null
      }],
      currentTicket: null,
      timeInterval: TimeInterval,
      ticketType: TicketType.types
    }
  },
  props: [
    'ticketData',
    'status'
  ],
  components: {
    'confirmation': require('components/increment/generic/modal/Confirmation.vue')
  },
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
      this.$parent.statusType = this.currentTicket.status
      // this.currentTicket.type.toUpperCase()
      // $('#loading').css({display: 'block'})
      // $('#loading').css({display: 'none'})
      this.$parent.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''}, ticket.status)

    },
    retrieveItems(item){
      ROUTER.push('/tickets/details/' + item.id)
    // },
    // showMessage(item, index){
    //   this.$parent.showMessage(item, index)
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
