<template>
<div class="holder">
  <basic-filter
      v-bind:category="category"
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter)"
      @changeStyle="manageGrid($event)"
      :grid="['list', 'th-large']"></basic-filter>

  <Pager
    :pages="numPages"
    :active="activePage"
    :limit="limit"
    v-if="data.length > 0"
  />

  <table class="table " id="myIssues">
    <thead>
      <tr class="d-flex border">
        <th class="col-2"
          id="typeBtn"
          v-for="(ticket,index) in tickets" :key="index"
          :class="{'active':(ticket.status === currentTicket)}"
          @click="activate(ticket)"
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
                  </span>

                  <button
                    disabled
                    :style="{backgroundColor: ticketTypeBackgroundColor(item.type), color: ticketTypeColor(item.type)}"
                    >{{item.type}}
                  </button>
                </div>
              </div>
              <p style="font-size: 12px;">{{item.created_at}}</p>
            </td>
        </tr>
      </tbody>
    </table>
  <messenger v-if="auth.messenger.data !== null"></messenger>
</div>
</template>

<script>
import Pager from 'components/increment/generic/pager/Pager.vue'
import FilterIssue from './FilterIssue.vue'
import AUTH from 'src/services/auth'
import ROUTER from 'src/router'
import TicketType from './TicketTypes.js'
export default {
  name: 'ticket',
  components: {
    'basic-filter': require('components/increment/generic/filter/Basic.vue'),
    Pager,
    'filter-issue': FilterIssue,
    'messenger': require('components/increment/messengervue/overlay/Holder.vue')
  },
  created() {
    this.auth.messenger.data = null
  },
  mounted(){
    if(this.$route.params.status){
      this.status = this.$route.params && this.$route.params.status ? this.$route.params.status.toUpperCase() : 'PENDING'
      this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''}, this.status)
    }else{
      this.status = null
      this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
    }
  },
  data(){
    return {
      data: [],
      status: null,
      user: AUTH.user,
      auth: AUTH,
      limit: 5,
      activePage: 1,
      currentFilter: null,
      currentSort: null,
      numPages: null,
      offset: 0,
      sort: null,
      filter: null,
      category: [{
        title: 'Sort by',
        sorting: [{
          title: 'Title ascending',
          payload: 'title',
          payload_value: 'asc'
        }, {
          title: 'Title descending',
          payload: 'title',
          payload_value: 'desc'
        }, {
          title: 'Status ascending',
          payload: 'status',
          payload_value: 'asc'
        }, {
          title: 'Status descending',
          payload: 'status',
          payload_value: 'desc'
        }, {
          title: 'Title ascending',
          payload: 'title',
          payload_value: 'asc'
        }, {
          title: 'Title descending',
          payload: 'title',
          payload_value: 'desc'
        }, {
          title: 'Created ascending',
          payload: 'created_at',
          payload_value: 'asc'
        }, {
          title: 'Created descending',
          payload: 'created_at',
          payload_value: 'desc'
        }]
      }],
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
      currentTicket: 'PENDING',
      ticketType: TicketType.types
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
    retrieveItems(item){
      ROUTER.push('/tickets/details/' + item.id)
    },
    activate(ticket) {
      this.currentTicket = ticket.status
      this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''}, ticket.status)

    },
    retrieve(sort, filter, status = 'PENDING') {
      if(this.status) {
        this.currentTicket = this.status
      }
      if(sort !== null){
        this.sort = sort
      }
      if(filter !== null){
        this.filter = filter
      }
      if(sort === null && this.sort !== null){
        sort = this.sort
      }
      if(filter === null && this.filter !== null){
        filter = this.filter
      }
      let parameter = {
        condition: [
          {
            value: filter.value + '%',
            column: filter.column,
            clause: 'like'
          },
          {
            value: status,
            column: 'status',
            clause: '='
          }],
        sort: sort,
        limit: this.limit,
        offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('tickets/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
        } else {
          this.data = []
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~assets/style/colors.scss";
.holder{
  width: 98%;
  float: left;
  margin-right: 2%;
  margin-top: 25px;
  margin-bottom: 50px;
}
#myIssues {
    width: 100%;
}
#myIssues thead:first-child th {
  font-weight: normal;
  cursor: pointer;
}
#typeBtn.active {
  font-weight:500 !important;
  border-bottom: solid $primary 1px;
}
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

.col-9 {
  padding: 10px;
  padding-left: 15px;
}
</style>
