<template>
  <div>
    <h3>Total products: {{total}}</h3> 
    <v-layout v-for="state in orderedstates" :key="state.stateafter" >
          <div id="state-icon">
            <v-img :src="iconFromAccount(state.stateafter)" class="custom-icon" />
          </div>
          <div id="state-explanation">
            <p>{{statusMessage(state)}}</p>
            <p>{{state.count}} / {{total}}</p>
          </div>
    </v-layout>
  </div>
</template>

<script>
  import backend from '../backend'

  export default {
    props: {
      account: {
        type: Object,
        required: true
      },
      orderedstates: {
        type: Array,
        required: true
      },
      total: {
        type: Number,
        required: true
      },
      baricons: {
        type: Object,
        required: true
      },
      clientbaricons: {
        type: Object,
        required: true
      }
    },


    methods: {
      statusMessage(state) {
        return backend.messageFromStatus(state.stateafter, this.account.usertype)
      },

      iconFromAccount(state) {
        if (this.account.usertype == 'Client') {
          return this.clientbaricons[state]
        }
        return this.baricons[state]
      }
    }

  }
</script>

<style scoped>
  .custom-icon {
    height: 40px;
    width: 40px
  }

  h3 {
    color: #515151;
    font-weight: normal;
    margin-top: 1em;
    margin-bottom: 1em;
    width: 90%;
    padding-bottom: 15px;
    border-bottom: 1px solid #D1D1D1;
  }

  #state-icon {
    margin-right: 1em;

  }
  
  div.layout {
    width: 90%;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #D1D1D1;
  }
</style>