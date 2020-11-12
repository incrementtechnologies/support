<template>
  <div>
    <button 
      class="btn btn-primary pull-right"
      data-toggle="modal" 
      data-target="#newIssueModal" 
      style="margin-bottom: 25px; float:right">
      <i class="fa fa-plus"></i>
      New Issue Ticket
    </button>
    <div class="modal fade" id="newIssueModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary">
            <h5 class="modal-title" id="exampleModalLabel">New Issue</h5>
            <button type="button" class="close" @click="imageList = []" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" class="text-white">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <span v-if="errorMessage !== null" class="text-danger text-center">
                <label><b>Opps! </b>{{errorMessage}}</label>
            </span>
            <br v-if="errorMessage !== null">
            <br>
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Enter the title of issue here" v-model="title">
            </div>
            <div class="form-group">
              <textarea type="text" class="form-control" placeholder="Enter the details of issue here" v-model="detail"></textarea>
            </div>
            <ticket-type id="label"/>
            <span style="color:grey"><b>Image attachments</b></span>
            <multiple-img-uploader :imageList="imageList"/>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-danger " data-toggle="modal" data-target="#newIssueModal" @click="cancel()">Cancel</button>
              <button type="button" class="btn btn-primary" @click="submit()">Submit</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import axios from 'axios'
import COMMON from 'src/common.js'
import MultipleImgUploader from './MultipleImgUploader'
import TicketType from './TicketType'

export default {
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      title: null,
      detail: null,
      option: false,
      common: COMMON,
      imageList: [],
      previewImg: null,
      parameter: {
        content: null,
        account_id: null,
        images: null,
        type: null
      }
    }
  },
  components: {
    'multiple-img-uploader': MultipleImgUploader,
    'ticket-type': TicketType
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    submit(){
      if(this.validate()){
        var content = {
          title: this.title,
          detail: this.detail
        }
        content = JSON.stringify(content)
        var images = JSON.stringify(this.imageList)
        this.parameter.content = content
        this.parameter.account_id = this.user.userID
        this.parameter.images = images
        let parameter = this.parameter
        $('#loading').css({display: 'block'})
        this.APIRequest('tickets/create', parameter).then(response => {
          $('#loading').css({display: 'none'})
          if(response.data > 0){
            $('#newIssueModal').modal('hide')
            // this.retrieve(response.data)
            // ROUTER.push('/tickets/details/' + response.data)
          }
        })
      }
    },
    retrieve(id){
      let parameter = {
        condition: [{
          value: id,
          column: 'id',
          clause: '='
        }],
        account_id: this.user.userID,
        inventory_type: this.common.ecommerce.inventoryType
      }
      this.APIRequest('products/retrieve', parameter).then(response => {
        if(response.data.length > 0){
          this.title = null
          this.content = null
          $('#newIssueModal').modal('hide')
          this.redirect('/product/edit/' + response.data[0].code)
        }
      })
    },
    validate(){
      if(this.title === null || this.title === ''){
        this.errorMessage = 'Title is required.'
        return false
      }
      return true
    },
    cancel(){
      this.imageList = []
      this.title = ''
      this.content = ''
    }
  }
}
</script>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.bg-primary{
  background: $primary !important;
}
textarea{
  min-height: 150px;
}
#label{
  width:15%;
}
</style>
