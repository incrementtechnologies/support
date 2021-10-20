<template>
<div class="holder">
  <!-- <button
    class="btn btn-primary pull-right"
    style="margin-bottom: 25px; float:right"
    @click="createTicket()">
    <i class="fa fa-plus"></i>
    New Issue Ticket
  </button> -->
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

  <ticket-table :ticketData="data" ref="ticketTable"/>
  <messenger v-if="auth.messenger.data !== null"></messenger>
</div>
</template>

<script>
import TableTicket from './TicketTable.vue'
import Pager from 'components/increment/generic/pager/Pager.vue'
// import Create from './CreateIssue.vue'
import FilterIssue from './FilterIssue.vue'
import AUTH from 'src/services/auth'
import ROUTER from 'src/router'

export default {
  name: 'ticket',
  components: {
    'basic-filter': require('components/increment/generic/filter/Basic.vue'),
    // 'create': Create,
    'ticket-table': TableTicket,
    Pager,
    'filter-issue': FilterIssue,
    'messenger': require('components/increment/messengervue/overlay/Holder.vue')
  },
  created() {
    this.statusType = 'PENDING'
    this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''})
    this.auth.messenger.data = null
  },
  mounted(){
    if(this.$route.params.status){
      this.statuss = this.$route.params && this.$route.params.status ? this.$route.params.status.toUpperCase() : 'PENDING'
      this.$refs.ticketTable.currentTicket = {status: this.statuss, value: null}
      this.statusType = this.statuss
      this.retrieve({created_at: 'desc'}, {column: 'created_at', value: ''}, this.statuss)
    }else{
      this.statuss = null
      this.$refs.ticketTable.currentTicket = {status: 'PENDING', value: null}
    }
  },
  data(){
    return {
      data: [],
      statuss: null,
      user: AUTH.user,
      auth: AUTH,
      limit: 5,
      activePage: 1,
      currentFilter: null,
      currentSort: null,
      numPages: null,
      offset: 0,
      statusType: '',
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
      }]
    }
  },
  methods: {
    createTicket() {
      ROUTER.push('/tickets/create/')
    },
    retrieve(sort, filter, status = 'PENDING') {
      console.log(this.$refs)
      this.$refs.ticketTable.currentTicket = {status: status, value: null}
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
        }
      })
    }
    // showMessage(item, index){
    //   AUTH.messenger.title = item.code
    //   AUTH.messenger.data = item
    // }
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
</style>
