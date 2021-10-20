<template>
  <div class="dropdown" id="label">
    <!-- <div v-if="isChangeable" data-toggle="dropdown">Labels<i class="fa fa-cog"></i></div> -->
    <div>Labels</div>
    <!-- <div v-else >Labels</div> -->
    <ul class="dropdown-menu" v-if="isChangeable" ref="dropdownMenu" v-observe-visibility="dropdownExited" > 
      <input type="text" 
      placeholder="Enter issue type"
        @keyup="findType" 
        @keydown="findKey"
        @mouseup="logSelectionWithinInput($event)"
        :value="ticketSearch"
        ref="selection"
        style="width:100%"
        >
      <button 
        class="btn btn-light" 
        id="typeBtn" 
        v-for="(item, index) in ticketOption" 
        :key="index" 
        style="width:100%;text-align:left;"
        @click="setParamType(item.type)"
        >
          <i class="fas fa-circle" :style="{ color: item.color }" id="circleIcn"></i> 
          <span>{{item.type}}</span>
      </button>
    </ul>
    <br>
    <button disabled id="button" v-if="typeResult" :style="{backgroundColor: typeResult.color, color: typeResult.textColor}">{{typeResult.type}}</button>
  </div>
</template>
<script>
import { ObserveVisibility } from 'vue-observe-visibility'
import TicketTypes from './TicketTypes.js'
export default {
  name: 'ticketType',
  data(){
    return {
      // list of all ticket types
      ticketTypes: null,
      // this references input elem
      searchInputField: null,
      // this is the value of input field
      ticketSearch: '',
      // value from selection using mouse
      selectionSearch: '',
      // this is the list of ticket types that passes the if cond
      ticketOption: null,
      typeResult: null,
      isChangeable: true
    }
  },
  props: ['isEditable'],
  watch: {
    isEditable: {
      handler(newValue) {
        if(newValue) {
          this.isChangeable = newValue.isEditable
          this.setParamType(newValue.typeResult)
        }
      }
    }
  },
  directives: {
    'observe-visibility': ObserveVisibility
  },
  created(){
    this.ticketTypes = TicketTypes.types
    this.ticketOption = this.ticketTypes
    if(this.isEditable){
      this.isChangeable = this.isEditable.isEditable
      this.typeResult = this.isEditable.typeResult
    }
  },
  mounted(){
    this.searchInputField = this.$refs.selection
  },
  methods: {
    logSelectionWithinInput(e){
      this.selectionSearch = e.target.value.substring(
        e.target.selectionStart,
        e.target.selectionEnd
      )
    },
    dropdownExited(isVisible, entry){
      if(isVisible){
        this.ticketSearch = ''
      }
    },
    findKey: function(e){
      setTimeout(() => {
        if(e.which <= 90 && e.which >= 48 || e.which === 8 || e.which === 46){
          if(e.which === 8 || e.which === 46) {
            if(this.selectionSearch){
              this.ticketSearch = this.ticketSearch.replace(this.selectionSearch, '')
            }else{
              this.ticketSearch = this.ticketSearch.slice(0, this.searchInputField.selectionStart) + this.ticketSearch.slice(this.searchInputField.selectionStart + 1)
            }
          }else {
            this.ticketSearch = this.ticketSearch.slice(0, this.searchInputField.selectionStart - 1) + e.key + this.ticketSearch.slice(this.searchInputField.selectionStart - 1)
          }
        }
      }, 10)
    },
    findType: function(e){
      var option = []
      if(e.which <= 90 && e.which >= 48 || e.which === 8 || e.which === 46){
        this.ticketTypes.forEach(el => {
          if(el.type.includes(this.ticketSearch)) {
            option.push(el)
          }
        })
        this.ticketOption = option
      }
    },
    setParamType(type){
      this.ticketTypes.forEach(el => {
        if(el.type === type){
          this.typeResult = el
          return
        }
      })
      this.ticketSearch = type
      if(this.$parent.parameter){
        this.$parent.parameter.type = type
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#label {
  min-height: 50px;
  line-height: 10px;
}
#label i {
  float: right;
  vertical-align: middle;
  line-height: 10px;
}
#label div {
  width: 100%;
  cursor: pointer;
}
#label div:hover {
  color: blue;
} 
#label .dropdown-menu {
  padding:5px !important;
}
#typeBtn {
  min-height: 50px;
  line-height: 10px;
}
#circleIcn {
  float: left!important;
  vertical-align: middle;
  line-height: 10px;
  margin-right: 15px;
}
#button{
  border-radius: 20px;
  height: 25px;
  min-width: 60px;
  border:0;
}
</style>
