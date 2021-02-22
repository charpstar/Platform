<template>
  <div>
    <h2>Total products: {{total}}</h2> 
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

  h2 {
    margin-bottom: 1em;
  }

  #state-icon {
    margin-right: 1em;
    margin-bottom: 1.5em;
  }
</style>