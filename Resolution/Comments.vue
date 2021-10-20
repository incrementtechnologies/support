<template>
 <!-- <div class="row" > -->
   <!-- <div>Try</div> -->
   <b-card>
        <b-card-text>
   <div>
    <comments :load="true" :payloadValue="payloadValue" :payload="'ticket_id'" />
   </div>
        </b-card-text>
   </b-card>
    <!-- <div class="col-10" id="detail">
      <form>
        <div class="form-group">
          <input v-model="message" id="comments" placeholder="comment here..." /> -->
              <!-- <i @click="create()" class="fa fa-paper-plane fa-lg" style="cursor: pointer;margin-left:1%;color: violet;"></i> -->
              <!-- <button @click="create()" class="reply--button" > Send</button>
              <hr>
          <b-card v-for="(item, index) in data" :key="index">
            <b-card-text>
              <b-card>
                <b-card-text>
                  {{item.account.username}}
                </b-card-text>
              </b-card>
            </b-card-text>
          </b-card> -->
            <!-- <button class="btn pull-right btn-danger">Close Ticket</button> -->
        <!-- </div>
      </form>
    </div> -->
 <!-- </div> -->
</template>
<script>
import AUTH from 'src/services/auth'
import Comments from 'src/components/increment/generic/comment/Comments'
export default {
  props: ['id'],
  data() {
    return {
      detail: null,
      message: null,
      // details: null,
      limit: 5,
      data: [],
      user: AUTH.user,
      payloadValue: this.$route.params.id,
      try: [
        {
          user_id: 1,
          username: 'Lalaine',
          time: 'March 26, 2021 08:51 AM',
          text: 'This is a test.',
          reply: []
        },
        {
          user_id: 1,
          username: 'Lalaine',
          time: 'March 26, 2021 08:55 AM',
          text: 'Testing purposes.',
          reply: []
        },
        {
          user_id: 1,
          username: 'Lalaine',
          time: 'March 26, 2021 08:59 AM',
          text: 'Nerissa.',
          reply: []
        }
      ]
    }
  },
  components: {
    'comments': Comments
  },
  mounted(){
    this.retrieve()
  },
  methods: {
    create() {
      let parameter = {
        account_id: this.user.userID,
        payload_value: this.id,
        payload: 'tickets',
        text: this.message
      }
      this.APIRequest('comments/create', parameter, response => {
        if (response.data !== null) {
        }
      })
    },
    retrieve() {
      let parameter = {
        condition: [{
          value: this.user.userID,
          column: 'account_id',
          clause: '='
        }],
        sort: {
          created_at: 'desc'
        },
        limit: this.limit,
        offset: 0
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('comments/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
          console.log('Datas', this.data)
        }else{
          this.data = null
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~assets/style/colors.scss";
#holder {
  margin-top: 50px;
  width: 98%;
}
#title {
  font-size: 24px;
}
form{
  margin-top: 25px;
}

#comments{
  border-radius: 50px;
  min-height: 40px;
  min-width:94%;
  outline: none;
  resize: none;
  padding-left: 1%;
  padding-top: 0%;
  border: 1px solid grey;
}


</style>
