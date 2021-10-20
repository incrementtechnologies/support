<template>
    <div>
        <div class="modal fade" id="assignees" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-md" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Assign</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="text-black">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table responsive">
                            <thead>
                                <th>Username</th>
                                <th>Position</th>
                                <th>Assign</th>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in assignees" :key="index">
                                    <td>{{item.username}}</td>
                                    <td>{{item.account_type}}</td>
                                    <td>
                                        <button class="btn btn-primary" v-if="item.id == (assign != null ? assign.id : item.id) && assign == null" @click="setAssignee(item.id, item.username)">Assign</button>
                                        <button class="btn btn-primary" v-if="item.id != (assign != null ? assign.id : item.id)" @click="setAssignee(item.id, item.username)">Assign</button>
                                        <button class="btn btn-secondary" v-if="(item.id === (assign != null ? assign.id : item.id)) && assign != null">Assigned</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-dismiss="modal">OK</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      assignees: null,
      assign: null
    }
  },
  props: ['isAssigned'],
  methods: {
    retrieveAssignees() {
      let parameter = {
        condition: [{
          value: 'USER',
          column: 'account_type',
          clause: '!='
        }, {
          value: 'PARTNER',
          column: 'account_type',
          clause: '!='
        }],
        sort: {
          account_type: 'asc'
        }
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('accounts/retrieve', parameter).then(response => {
        console.log('[response]', response, this.isAssigned)
        $('#loading').css({display: 'none'})
        if(response.data.length > 0) {
          this.assignees = response.data
          this.assign = this.isAssigned
          $('#assignees').modal('show')
        } else {
          this.assignees = null
        }
      })
    },
    setAssignee(id, username){
      this.$parent.assigned = id
      this.$parent.assignee = username
    }
  }
}
</script>
