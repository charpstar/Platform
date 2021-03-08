<template>
<!-- This component includes the buttons for copying and uploading product links 
    and the button to compare versions -->

  <div :id="account.usertype == 'Client' ? 'versionsClient' : 'versions'">
      <!-- Layout for all users except client -->
      <div v-if="account.usertype !== 'Client'" class="links">
        <div class="link">
            <p class="copy">
                <v-btn 
                  class="actionBtn"
                  @click="() => { toClipboard(product.newandroidlink) }" 
                  rounded 
                  :disabled="!product.newandroidlink">
                    <span>Android Link</span>
                    <v-icon>mdi-android</v-icon>
                </v-btn>
            </p>
            <p>
              <modelupload v-if="account.usertype != 'Client'" :model="model" :product="product"
                  :uploadfun="androidUploadFun" :filetype="'glb'" @upload="uploadedAndroid"
                  @opened="hideMv = $event" />
            </p>
        </div>
        <div class="link">
            <p class="copy">
                <v-btn 
                  class="actionBtn"
                  @click=" () => { toClipboard(product.newioslink) }" 
                  rounded  
                  :disabled="!product.newioslink">
                    <span>iOS Link</span>
                    <v-icon>mdi-apple</v-icon>
                </v-btn>
            </p>
            <p>
              <modelupload v-if="account.usertype != 'Client'" :model="model" :product="product"
                  :uploadfun="iosUploadFun" :filetype="'usdz'" @upload="uploadedIos" @opened="hideMv = $event" />
            </p>
        </div>
      </div>
      <!-- Layout for client user -->
      <div v-if="account.usertype == 'Client'" class="link">
          <p class="copy">
              <v-btn 
                class="actionBtn"
                @click=" () => { toClipboard(product.newandroidlink) }" 
                rounded 
                :disabled="!product.newandroidlink">
                  <span>Android Link</span>
                  <v-icon>mdi-android</v-icon>
              </v-btn>
          </p>
          <p>
            <modelupload v-if="account.usertype != 'Client'" :model="model" :product="product"
                :uploadfun="androidUploadFun" :filetype="'glb'" @upload="uploadedAndroid"
                @opened="hideMv = $event" />
          </p>
      </div>
      <div v-if="account.usertype == 'Client'" class="link">
          <p class="copy">
              <v-btn 
                class="actionBtn"
                @click=" () => { toClipboard(product.newioslink) }" 
                rounded                        
                :disabled="!product.newioslink">
                  <span>iOS Link</span>
                  <v-icon>mdi-apple</v-icon>
              </v-btn>
          </p>
          <p>
            <modelupload v-if="account.usertype != 'Client'" :model="model" :product="product"
                :uploadfun="iosUploadFun" :filetype="'usdz'" @upload="uploadedIos" @opened="hideMv = $event" />
          </p>
      </div>
      <!-- The following components exist for all users but are displayed differently 
        for client, as specified in styling section -->
      <modelversions
        :product="product"
        @opened="hideMv = $event"
        v-if="product.oldandroidlink"
      ></modelversions>
      <confirmmodal
        v-if="
          (account.usertype == 'QA' || account.usertype == 'Admin') && false
        "
        :handler="del"
        :title="'Confirm product delete'"
        :text="'This will delete the product and related files and comments'"
        :buttonText="'Delete product'"
        :icon="'mdi-delete'"
        :color="'#d12300'"
      />
      <v-snackbar v-model="snackbar" :timeout="3000">
        Link copied to clipboard
      </v-snackbar>
  </div>
</template>

<script>
  import modelversions from './VersionModal'
  import confirmmodal from './ConfirmModal'
  import modelupload from './ModelUpload'
  import backend from './../backend'


  export default {
      components: {
        modelversions,
        modelupload,
        confirmmodal 
      },
      
      props: {
        account: { type: Object, required: true },
        model: { type: Object, required: true },
        product: { type: Object, required: true }
      },

      data () {
        return {
          snackbar: false,
          androidUploadFun: backend.uploadAndroidModel,
          iosUploadFun: backend.uploadIosModel,
        }
      },

      methods: {
        /* Methods moved from ProductView, as they are only relevant for the 'link' buttons */
        uploadedAndroid(values) {
          this.product.newandroidlink = values[0].new.androidlink
          if (values[1] != null) {
            this.model.thumbnail = values[1]
          }
        },
        uploadedIos(values) {
          this.product.newioslink = values[0].new.ioslink
          if (values[1] != null) {
            this.model.thumbnail = values[1]
          }
        },
        toClipboard(text) {
          var vm = this
          vm.$copyText(text).then(
            () => {
              vm.snackbar = true
            },
            () => {
              alert('Could not copy')
            }
          )
        }
      }
    
  }
</script>

<style lang="scss" scoped>
    .actionBtn {
    color: white;
      span {
        margin-right: 0.5em;
      }
    }

    /*  Styling of the links and 'compare versions' layout for non-client view*/
    #versions {
      display: flex;
      flex-direction: column;
      align-items: center;
        .links {
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .link {
          display: flex;
        }
        .copy {
          margin-right: 5px;
        }
    }

    /*  Styling of the links and 'compare versions' layout for client view*/
    #versionsClient {
      display: flex;
      justify-content: space-around;
      align-items: center;
        .links{
          display: flex;
        }
    }
</style>