<template>
<div id="holder">
  <div class="title" style="margin-top: 25px;">
    <label class="text-primary action-link" @click="redirect('/tickets')"><i class="fas fa-arrow-left"></i> <b> back </b>to previous</label>
  </div>
  <div v-if="data">
    <span id="title"> <b> {{title}} </b> #{{data.id}} </span>
    <br>
    <span> {{status}} {{ timeIntervalRes + ' ago'}} by {{data.account_id}} </span>
  </div>
  <div class="row">
    <span id="title"><b>Create Issue Ticket</b></span>
  </div>
  <div class="row">
     <div class="col-md-9" id="detail">
      <form>
        <div class="form-group">
          <label for="text"><b>Title</b></label>
          <input type="text" class="form-control" v-model="title" placeholder="Enter ticket title" id="text">
        </div>
        <div class="form-group">
          <label for="detail"><b>Details</b></label>
          <textarea type="text" v-model="detail" placeholder="Enter ticket description"  class="form-control"  id="detail"/>
        </div>
        <span><b>Image attachments</b></span><br>

        <multiple-img-uploader :imageList="imageList" :isEditableProp="editable"/>
        <button type="button" class="btn btn-primary mb-5" @click="create()" id="update">Submit</button>
      </form>
    </div>
    <div class="col-md-3 " id="uneditableDetail">
      <div>
        <ticket-type :isEditable="data ? {isEditable: user.userID === data.account_id, typeResult: data.type} : ''"/>
      <hr>
      <div style="width:100%;">
        <span>Assignee</span>
        <br>
        <assignees ref="assign"></assignees>
        <span @click="showAssignees()" style="color:grey; cursor: pointer;"><u><i class="fas fa-user-plus"></i>&nbsp;&nbsp;{{ assignee ? assignee : 'Add assigned resolver'}}</u></span>
      </div>
      <hr>
      <span>Status</span>
      <p style="color:grey">{{ data ? data.status : 'not available'}}</p>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import MultipleImgUploader from './MultipleImgUploader'
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import TimeInterval from './TimeInterval.js'
import TicketType from './TicketTypes.js'
import TicketTypeComp from './TicketType.vue'
import CONFIG from 'src/config.js'
import Comments from './Comments.vue'

export default {
  data() {
    return {
      user: AUTH.user,
      config: CONFIG,
      imageList: [],
      data: null,
      timeInterval: TimeInterval,
      title: null,
      detail: null,
      status: null,
      ticketType: TicketType.types,
      timeIntervalRes: null,
      editable: true,
      imgListLimit: 4,
      parameter: {
        type: null
      },
      assignee: null
    }
  },
  components: {
    'ticket-type': TicketTypeComp,
    'multiple-img-uploader': MultipleImgUploader,
    'assignees': require('./Assignees.vue'),
    Comments
  },
  methods: {
    showAssignees(){
      this.$refs.assign.retrieveAssignees()
    },
    create() {
      let parameter = {
        content: this.title,
        type: this.parameter.type,
        account_id: this.user.userID,
        images: this.imageList.join(' '),
        assigned_to: this.assignee,
        status: 'pending'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('tickets/create', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data > 0){
          this.redirect('/tickets')
        }
      })
    },
    manageImageUrl(url) {
      this.imageList.push(url)
    },
    redirect(path){
      ROUTER.push(path)
    },
    getticketTimePassed(time){
      var ticketCreation = new Date(time)
      var current = new Date()
      var difference = (current - ticketCreation)
      let result = this.timeInterval.getticketTimePassed(difference)
      let timePassedFormat = ''
      console.log(difference, result)
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
#deleteBtn{
  position: absolute;
  top: 8px;
  right: 10px;
  border-radius: 20px;
}
#imgListPreview {
  width:100%;
  background-color:  rgba(0,0,0,.15);
  height: 200px;
}
#imgPreview {
  width:100%;
  border: 1px solid white;
  height: 200px;
}

#imgNotExist, #imgNotExist i {
  color:grey;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.row{
  margin:auto;
}
.col-md-9 {
    padding-left: 0 !important;
    // padding-right: 0 !important;
  }
.col-md-3 {
  padding-right: 0 !important;
}
#holder {
  margin-top: 50px;
}
#title {
  font-size: 24px;
}
textarea{
  min-height: 200px;
}
form{
  margin-top: 25px;
}
#detail input{
  min-height: 75px;
}

#uneditableDetail div{
  margin-top: 50px;
}
#uneditableDetail #ticketType {
  background-color: red;
  border:none;
  border-radius: 20px;
  min-width: 50px;
  color: white;
}
#update{
  float: right;
}
</style>
