<template>
  <div>
    Total products: {{total}}
    <p v-for="state in orderedstates" :key="state.stateafter">
      {{statusMessage(state)}} : {{state.count}} / {{total}}
      <v-img 
        :src="iconFromAccount(state.stateafter)"
        class="custom-icon"
      />
    </p>
  </div>
</template>

<script>
import backend from '../backend'

export default {
    props: {
        account: {type: Object, required: true},
        orderedstates: {type: Array, required: true},
        total: {type: Number, required: true},
        baricons: {type: Object, required: true},
        clientbaricons: {type: Object, required: true}
    },
    

    methods: {
        statusMessage(state) {
            return backend.messageFromStatus(state.stateafter, this.account.usertype)
        },

        iconFromAccount(state) {
            if(this.account.usertype == 'Client') {
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

</style>
