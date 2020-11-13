<template>
<div class="holder">
  <!-- <filter-issue
    v-bind:category="category" 
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter)"
  /> -->
  <!-- <create v-if="user.type !== 'ADMIN'"/>
   -->
  <!-- <create/> -->
  <button 
    class="btn btn-primary pull-right"
    style="margin-bottom: 25px; float:right"
    @click="createTicket()">
    <i class="fa fa-plus"></i>
    New Issue Ticket
  </button>
  <ticket-table :ticketData = "data"/>
   <Pager
      :pages="numPages"
      :active="activePage"
      :limit="limit"
      v-if="data !== null"
    />
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
    // 'create': Create,
    'ticket-table': TableTicket,
    Pager,
    'filter-issue': FilterIssue,
    'messenger': require('components/increment/messengervue/overlay/Holder.vue')
  },
  created() {
    this.statusType = 'OPEN'
    this.retrieve()
    this.auth.messenger.data = null
  },
  mounted(){
  },
  data(){
    return {
      data: [],
      user: AUTH.user,
      auth: AUTH,
      limit: 5,
      activePage: 1,
      numPages: null,
      statusType: ''
    }
  },
  methods: {
    createTicket() {
      ROUTER.push('/tickets/create/')
    },
    retrieve() {
      if(this.statusType.toUpperCase() === 'OPEN') {
        this.statusType = this.statusType.toUpperCase()
      }
      let parameter = {
        condition: [{
          value: this.statusType,
          column: 'status',
          clause: '='
        }],
        sort: {
          status: 'desc'
        },
        limit: this.limit,
        offset: (this.activePage > 0) ? ((this.activePage - 1) * this.limit) : this.activePage
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('tickets/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          console.log('df', this.data)
          this.numPages = parseInt(response.size / this.limit) + (response.size % this.limit ? 1 : 0)
        }else{
          this.data = null
          this.numPages = null
        }
      })
    },
    showMessage(item, index){
      AUTH.messenger.title = item.code
      AUTH.messenger.data = item
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
</style>
