<template>
  <div id="item">
    <edittextmodal :label="'link'" :handler="edit" :text="product.link"
      >Edit product link</edittextmodal
    >
    <edittextmodal :label="'model id'" :handler="editId" :text="product.modelid"
      >Edit product parent model</edittextmodal
    >
    <!-- <div class="flexrow" id="itemsrow"> -->
    <div id="itemsrow">
      <!-- If screen is smaller than 550px, apply class "mobileView" and related styling
      to display all elements in the screen properly -->
      <div id="productTitle" :class="$vuetify.breakpoint.width < 550 ? 'mobileView' : ''">
        <p>{{ product.color }}</p>
        <p class="productBtns">
            <a :href="product.link" target="_blank">
            <v-btn rounded class="actionBtn">
              <span>Product page</span>
              <v-icon>mdi-link</v-icon>
            </v-btn>
            </a>
            <!-- Replaced the tooltip for editing the product page with a button -->
            <v-btn
              outlined
              rounded
              id="editBtn"
              @click="edit.modal = true"
              v-if="account.usertype == 'Client'"
            >
              <span>Edit</span>
              <v-icon class="iconColor">mdi-border-color</v-icon>
            </v-btn>
        </p>
        
      </div>

      <div class="column" style="position:relative;">
        <v-btn icon @click="reload" class="reloadIcon">
          <v-icon>mdi-reload</v-icon>
        </v-btn>

        <model-viewer
          :src="'http://' + product.newandroidlink"
          auto-rotate
          camera-controls
          id="modelViewer"
          v-if="!hideMv"
        ></model-viewer>
        <div id="modelViewer" v-else></div>
      </div>

      <!-- <div class="column"> -->
        <!-- Table replaced with new 'div' structure in component 'ProductVersions'-->

        <!-- <table id="itemTable"> -->
        <!-- <tr v-if="account.usertype == 'QA' || account.usertype == 'Admin'">
                        <td class="modelid">Parent Modelid</td>
                        <td >
                            {{product.modelid}}
                            <v-tooltip>
                                <template v-slot:activator="{ on }">
                                    <v-icon class="iconColor" v-on="on" @click="editId.modal = true">mdi-border-color</v-icon>
                                </template>
                                <span>Change parent model</span>
                            </v-tooltip>
                        </td>
                    </tr> -->
        <!-- <tr>
                        <td>Status</td>
                        <td>
                            {{backend.messageFromStatus(product.state, account.usertype)}}
                            <v-icon>{{backend.iconFromStatus(product.state, account.usertype)}}</v-icon>
                        </td>
                    </tr> -->
        <!-- <tr>
                        <td>Product page</td>
                        <td>
                            <a :href="product.link" target="_blank">
                                <v-icon class="iconColor">mdi-share</v-icon>
                            </a>
                            <v-tooltip bottom v-if="account.usertype == 'Client'">
                                <template v-slot:activator="{ on }">
                                    <v-btn icon dark v-on="on" @click="edit.modal = true">
                                        <v-icon class="iconColor">mdi-border-color</v-icon>
                                    </v-btn>
                                </template>
                                <span>Edit</span>
                            </v-tooltip>
                        </td>
                    </tr> -->
        <!-- <tr>
                        <td>Android link</td>
                        <td>
                            <v-btn
                                @click="() => {toClipboard(product.newandroidlink)}"
                                icon
                                v-if="product.newandroidlink"
                            >
                                <v-icon class="iconColor">mdi-clipboard-text-outline</v-icon>
                            </v-btn>
                            <modelupload
                                v-if="account.usertype != 'Client'"
                                :model="model"
                                :product="product"
                                :uploadfun="androidUploadFun"
                                :filetype="'glb'"
                                @upload="uploadedAndroid"
                                @opened="hideMv = $event"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>iOS link</td>
                        <td>
                            <v-btn
                                @click="() => {toClipboard(product.newioslink)}"
                                icon
                                v-if="product.newioslink"
                            >
                                <v-icon class="iconColor">mdi-clipboard-text-outline</v-icon>
                            </v-btn>
                            <modelupload
                                v-if="account.usertype != 'Client'"
                                :model="model"
                                :product="product"
                                :uploadfun="iosUploadFun"
                                :filetype="'usdz'"
                                @upload="uploadedIos"
                                @opened="hideMv = $event"
                            />
                        </td>
                    </tr> -->
        <!-- <tr>
                        <td>
                            <modelversions :product="product" @opened="hideMv = $event" v-if="product.oldandroidlink"></modelversions>
                            <confirmmodal 
                                v-if ="(account.usertype == 'QA' || account.usertype == 'Admin') && false" 
                                :handler="del" 
                                :title="'Confirm product delete'"
                                :text="'This will delete the product and related files and comments'"
                                :buttonText="'Delete product'"
                                :icon="'mdi-delete'"
                                :color="'#d12300'"
                            />
                        </td>
                    </tr> -->
        <!-- </table> -->
      <!-- </div> -->

      <!-- Tabs replaced with expansion panels:  -->

      <!-- <v-tabs v-model="commentsTab">
                    <v-tabs-slider></v-tabs-slider>
                    <v-tab v-if="account.usertype != 'Client'" :href="`#qa`">Internal Comments</v-tab>
                    <v-tab v-if="account.usertype != 'Modeller'" :href="`#client`">{{account.usertype == 'Client' ? 'Comments' : 'Client Comments'}}</v-tab>
                    <v-tab-item :value="'qa'" class="tab">
                        <comments
                            :idobj="{productid: product.productid}"
                            :type="'Product'"
                            :review="account.usertype != 'Modeller' && product.state == 'ProductReview' && model.modelowner != null"
                            :markdone="account.usertype == 'Modeller' && ['ProductDev', 'ProductRefine', 'ClientFeedback'].includes(product.state)"
                            :markdonedisabled="model.files.length == 0"
                            :markinfo="account.usertype == 'Modeller' && ['ProductDev', 'ProductRefine', 'ClientFeedback'].includes(product.state)"
                            :markresolve="account.usertype != 'Modeller' && product.state == 'ProductMissing'"
                            :internal="true"
                            @state="$emit('state', $event)"
                        />
                    </v-tab-item>
                    <v-tab-item :value="'client'" class="tab">
                        <comments
                            :idobj="{productid: product.productid}"
                            :type="'Product'"
                            :review="account.usertype == 'Client' && product.state == 'ClientProductReceived'"
                            :markdone="account.usertype != 'Client' && product.state == 'ProductReview'"
                            :markinfo="account.usertype != 'Client' && !(['Done', 'ProductQAMissing', 'ClientProductReceived'].includes(product.state))"
                            :markresolve="account.usertype != 'Client' && product.state == 'ProductQAMissing'"
                            @state="$emit('state', $event)"
                        />
                    </v-tab-item>
                </v-tabs> -->
        <product-versions 
          :account="account"
          :product="product"
          :model="model"
        />

      <v-expansion-panels class="expansionPanels">
        <v-expansion-panel>
          <v-expansion-panel-header isable-icon-rotate style="background:rgb(134,134,134,0.1);"
            v-if="account.usertype != 'Client'"
            disable-icon-rotate
          >
            Internal Comments
             <template v-slot:actions>
                  <v-icon class="expansionIcon">
                      mdi-wechat
                  </v-icon>
              </template>	
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <!-- Indlude prop "markapprovedisabled" to disable approve button
            when either android or ios link is missing -->
            <comments
              :idobj="{ productid: product.productid }"
              :type="'Product'"
              :review="
                account.usertype != 'Modeller' &&
                  product.state == 'ProductReview' &&
                  model.modelowner != null
              "
              :markdone="
                account.usertype == 'Modeller' &&
                  ['ProductDev', 'ProductRefine', 'ClientFeedback'].includes(
                    product.state
                  )
              "
              :markdonedisabled="model.files.length == 0"
              :markapprovedisabled="!product.newioslink || !product.newandroidlink"
              :markinfo="
                account.usertype == 'Modeller' &&
                  ['ProductDev', 'ProductRefine', 'ClientFeedback'].includes(
                    product.state
                  )
              "
              :markresolve="
                account.usertype != 'Modeller' &&
                  product.state == 'ProductMissing'
              "
              :internal="true"
              @state="$emit('updated-model')"
            />
            <!-- @state="$emit('state', $event)" -->
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel v-if="account.usertype != 'Modeller'">
          <v-expansion-panel-header
            disable-icon-rotate isable-icon-rotate style="background:rgb(134,134,134,0.1);"
          >
            {{ account.usertype == 'Client' ? 'Comments' : 'Client Comments' }}
             <template v-slot:actions>
                  <v-icon class="expansionIcon">
                      mdi-wechat
                  </v-icon>
              </template>	
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <comments
              :idobj="{ productid: product.productid }"
              :type="'Product'"
              :review="
                account.usertype == 'Client' &&
                  product.state == 'ClientProductReceived'
              "
              :markdone="
                account.usertype != 'Client' && product.state == 'ProductReview'
              "
              :markinfo="
                account.usertype != 'Client' &&
                  ![
                    'Done',
                    'ProductQAMissing',
                    'ClientProductReceived'
                  ].includes(product.state)
              "
              :markresolve="
                account.usertype != 'Client' &&
                  product.state == 'ProductQAMissing'
              "
              @state="$emit('updated-model')"
            />
            <!-- @state="$emit('state', $event)" -->
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <!-- Moved to  ProductVersions.vue -->
    <!-- <v-snackbar v-model="snackbar" :timeout="3000">
      Link copied to clipboard
    </v-snackbar> -->
  </div>
</template>
<script>
  
  import backend from './../backend'
  import comments from './CommentView'
  import edittextmodal from './EditTextModal'
  import productVersions from './ProductVersions'

  /* Moved to ProductVersions.vue */

  // import confirmmodal from './ConfirmModal'
  // import modelupload from './ModelUpload'
  // import modelversions from './VersionModal'

  export default {
    components: {
      comments,
      edittextmodal,
      productVersions

      /* Moved to ProductVersions.vue */

      // confirmmodal,
      // modelupload,
      // modelversions,
    },
    props: {
      account: { type: Object, required: true },
      model: { type: Object, required: true },
      product: { type: Object, required: true }
    },
    data() {
      return {
        commentsTab: '',
        hideMv: true,
        edit: backend.promiseHandler(this.editLink),
        editId: backend.promiseHandler(this.editIdFun),
        del: backend.promiseHandler(this.deleteProduct),
        backend: backend
        /* Moved to ProductVersions.vue */
        // snackbar: false,
        // androidUploadFun: backend.uploadAndroidModel,
        // iosUploadFun: backend.uploadIosModel,
      }
    },
    methods: {
      deleteProduct() {
        var vm = this
        return backend.deleteProduct(vm.product.productid).then(() => {
          // How is this going to work with the new display of models' list
          // next to model details? Should we remove the following code?
          vm.$router.go(-1)
        })
      },
      editLink(newlink) {
        var vm = this
        return backend
          .editProductLink(vm.product.productid, newlink)
          .then(() => {
            vm.product.link = newlink
          })
      },
      editIdFun(newid) {
        var vm = this
        return backend
          .editProductModelId(vm.product.productid, newid)
          .then(() => {
            vm.product.modelid = newid
          })
      },

      /* Moved to ProductVersions.vue */

      // uploadedAndroid(values) {
      //   this.product.newandroidlink = values[0].new.androidlink
      //   if (values[1] != null) {
      //     this.model.thumbnail = values[1]
      //   }
      // },
      // uploadedIos(values) {
      //   this.product.newioslink = values[0].new.ioslink
      //   if (values[1] != null) {
      //     this.model.thumbnail = values[1]
      //   }
      // },
      // toClipboard(text) {
      //   var vm = this
      //   vm.$copyText(text).then(
      //     () => {
      //       vm.snackbar = true
      //     },
      //     () => {
      //       alert('Could not copy')
      //     }
      //   )
      // },
      reload() {
        var vm = this
        vm.hideMv = true
        vm.$nextTick(() => {
          vm.hideMv = false
        })
      }
    },
    mounted() {
      var vm = this
      setTimeout(() => {
        vm.hideMv = false
      }, 500)
      // eslint-disable-next-line no-console
      console.log(this.product)
    }
  }
</script>

<style lang="scss" scoped>
  .colorCell {
    padding-left: 8px;
  }
  // #item {
  //   width: 80vw;
  // }
  #itemTable {
    font-size: 20px;
    color: grey;
  }
  #modelViewer {
    width: 400px;
    height: 400px;
    margin-right: 20px;
  }
  #itemsrow {
    align-items: flex-start;
  }
  #topRow {
    justify-content: start;
  }

  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    // align-items: flex-start;
  }

  #default-progress-bar {
    display: none !important;
  }

  .reloadIcon {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    .v-icon {
      color: lightgray;
    }
  }

  .v-input {
    width: 350px;
  }

  .modelid {
    padding-right: 10px;
  }

  #productTitle {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 5px;
  }

  .productBtns {
    width: 50%;
    display: flex;
    justify-content: space-around;
  }

  .mobileView#productTitle {
    display: flex;
    flex-direction: column;
    margin-bottom: 5px;
  }

  .mobileView .productBtns {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    width: 100px;
    > * {
      margin-right: 10px;
    }
  }

  .actionBtn {
    color: white;
    span {
      margin-right: 0.5em;
    }
  }

  #editBtn {
    background-color: white !important;
    color: #1fb1a9;
  }

  .expansionPanels {
    margin-top: 20px;
    padding-right: 20px;
  }

  .expansionIcon {
    margin-left: 10px;
    color: #515151!important;
  }
</style>
