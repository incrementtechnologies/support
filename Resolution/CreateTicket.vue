<template>
<!-- style="background-color:red" -->
<div id="holder"> 
  <div class="title" style="margin-top: 25px;">
    <label class="text-primary action-link" @click="redirect('/tickets')"><b> back </b>to previous</label>
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
        <label><b>Image Attachment</b></label>
        <div class="form-group">
        <div id="imgListPreview" class="row">
            <div 
            v-for="index in imgListLimit" :key="index" 
            id="imgPreview" 
            class="col-3"
            >
            <!-- <span class="close">x</span> -->
              <button type="button" class="btn btn-danger" id="deleteBtn" data-toggle="modal" data-target="#confirm-delete">
                <i class="fa fa-times"></i>
              </button>
              <div v-if="imageList[index]">
                <img :src="config.BACKEND_URL + imageList[index]" :alt="imageList[index]" style="width:100%;height:100%">
              </div>
              <div v-else id="imgNotExist">
                <i class="fas fa-image"></i><br>
                no image
              </div>
            </div>
        </div></div>
        <!-- <browse-images-modal :object="user.profile" v-if="user.profile !== null"></browse-images-modal> -->
        <browse-images-modal  v-if="user.profile === null"></browse-images-modal>
        <button class="btn btn-primary custom-block" style="margin-top: 5px;" @click="showImages()">Select from images
        </button>                        
        <button type="button" class="btn btn-primary" id="update">{{data ? 'update' : 'submit'}}</button>
      </form>
    </div>
    <div class="col-md-3 " id="uneditableDetail">
      <div>
        <ticket-type :isEditable="data ? {isEditable: user.userID === data.account_id, typeResult: data.type} : ''"/>
      <hr>
      <div style="width:100%;">
        <span>Assignee</span>
        <br>
        <span style="color:grey">{{ data ? data.assigned_to ? data.assigned_to : 'no assigned resolver' : 'no assigned resolver'}}</span> <i class="fa fa-plus" aria-hidden="true" style="float:right"></i>
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
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import TimeInterval from './TimeInterval.js'
import TicketType from './TicketTypes.js'
import TicketTypeComp from './TicketType.vue'
import CONFIG from 'src/config.js'

export default {
  created() {
    // this.retrieveItem(this.id)
  },
  mounted(){
  },
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
      imgListLimit: 4
    }
  },
  components: {
    'ticket-type': TicketTypeComp,
    'browse-images-modal': require('components/increment/generic/image/BrowseModal.vue')
  },
  methods: {
    manageImageUrl(url) {
      this.imageList.push(url)
    },
    showImages(){
      $('#browseImagesModal').modal('show')
    },
    hideImages(){
      $('#browseImagesModal').modal('hide')
    },
    redirect(path){
      ROUTER.push(path)
    },
    retrieveItem(id){
      let parameter = {
        condition: [{
          value: id,
          column: 'id',
          clause: '='
        }]
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('tickets/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data[0]
          this.timeIntervalRes = this.getticketTimePassed(this.data.created_at)
          this.data.status = this.data.status.toLowerCase()
          this.imageList = JSON.parse(this.data.images)
          this.editable = this.user.userID === this.data.account_id
          switch(this.data.status.toLowerCase()){
            case 'open':
              this.status = 'opened'
              break
            case 'pending':
              this.status = 'moved to pending status'
              break
            case 'close':
              this.status = 'closed'
              break
          }
          this.title = this.data.content[0] === '{' ? JSON.parse(this.data.content).title : this.data.content
          this.detail = this.data.content[0] === '{' ? JSON.parse(this.data.content).detail : this.data.content
        }else{
          this.data = null
        }
      })
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
