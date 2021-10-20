  <template>
  <div class="d-flex">

    <div class="col-7 preview d-flex justify-content-center align-items-center"
      :style="[previewImg == null ? {'opacity': '0.3', 'background-color': 'grey'}: {'border': 'solid 1px black'}]">
      <i v-if="previewImg == null" class="fas fa-image" style="font-size: 150px;"></i>
      <img v-else :src="previewImg" alt="preview image">
    </div>

    <div class="col-5" id="selectedImg">
      <div id="imgCount">
        <p > images <b>{{imgCount}}/11</b></p>
      </div>
      <div class="d-flex flex-wrap">
        <input type="file" ref="file" name="attachment" @change="updateImg" style="display: none;">
        <!-- <div class="d-flex justify-content-center align-items-center" id="selectImg" @click="imgCount < 11 && isEditable ? $refs.file.click() : ''">
          <i class="fas fa-plus" style="color:grey" v-if="imgCount < 11 && isEditable"></i>
          <p v-else-if="!isEditable" style="margin-top:15px;">View</p>
          <p v-else style="margin-top:15px;">Full</p>
        </div> -->
        <div v-for="(img,index) in imageList" :key="index" id="selectImg">
          <img :src="img" :alt="img">
          <div class="overlay">
              <i class="fas fa-eye" id="icon" @click="previewImg = img"></i>
              <!-- <i class="fas fa-trash" id="icon" v-if="isEditable" @click="deleteImg(index)"></i> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import axios from 'axios'
export default {
  name: 'multiple-img-uploader',
  data(){
    return {
      previewImg: null,
      imgCount: 0,
      isEditable: true,
      file: null,
      user: AUTH.user,
      config: CONFIG

    }
  },

  watch: {
    imageList: {
      handler() {
        this.imgCount = this.imageList.length
        if(this.imgCount === 0) {
          this.previewImg = null
        }
      }
    },
    isEditableProp: {
      handler(newVal){
        this.isEditable = newVal
      }
    }
  },
  props: [
    'imageList',
    'isEditableProp'
  ],
  mounted(){
    if(this.isEditableProp){
      this.isEditable = this.isEditableProp
    }
  },
  methods: {
    updateImg(event){
      let files = event.target.files || event.dataTransfer.files
      if(!files.length){
        return false
      }else{
        this.file = files[0]
        this.createFile(files[0])
      }
      if (files && files[0]) {
        let reader = new FileReader()
        reader.onload = e => {
          this.$parent.imageList.push(e.target.result)
        }
        reader.readAsDataURL(files[0])
      }
    },
    createFile(file){
      let fileReader = new FileReader()
      fileReader.readAsDataURL(event.target.files[0])
      this.upload()
    },
    upload(){
      if(parseInt(this.file.size / 1024) > 1024){
        this.errorMessage = 'Allowed size is up to 1 MB only'
        this.file = null
        return
      }
      let image = this.file.name.replace(' ', '_')
      // this.$parent.imageList.push(image)
      this.prevIndex = null
    },
    deleteImg(itemIndex){
      var imgToDelete = this.$parent.imageList[itemIndex]
      if(this.previewImg === imgToDelete){
        this.previewImg = null
      }
      if(confirm('are you sure you want to delete the image?')) {
        this.$parent.imageList.splice(itemIndex, 1)
        this.$parent.update()
      }
    }
    // updateImg(e){
    //   var file = e.target.files || e.dataTransfer.files
    //   if(!file.length){
    //     return
    //   }
    //   if (file && file[0]) {
    //     let reader = new FileReader()
    //     reader.onload = e => {
    //       this.$parent.imageList.push(e.target.result)
    //     }
    //     reader.readAsDataURL(file[0])
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
  #icon:hover {
  color: red;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: .3s ease;
  background: rgba(255,255,255, 0.9);
  text-align: center;
}
#selectImg{
  position: relative;
  margin-left: 5px;
}
#selectImg:hover .overlay {
  opacity: 1;
}

#icon {
  color: black;
  font-size: 25px;
  transform: translateY(75%);
  -ms-transform: translateY(75%);
}
.preview{
  height: 300px;
  width: 100%;
}

.preview img{
  height: 100%;
  width: 100%;
}

#selectedImg #selectImg {
  height: 70px;
  width: 70px;
  border: solid 1px grey;
  cursor: pointer;
  margin-bottom: 5px;
}

#selectedImg #selectImg img{
  height: 100%;
  width: 100%;
}
.col-5 {
  padding-right: 0 !important;
}

.col-7 {
  padding: 0 !important;
}
#imgCount {
  width: 100% !important;
  text-align: right;
}
</style>

