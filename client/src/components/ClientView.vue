<template>
<div>
    <div id="clientView">
        <v-data-table id="table" :headers="headers" :items="clients" :items-per-page="-1" @click:row="handleClick">
            <template v-slot:item.icon="{value}">
                <img :src="value" class="itemIcon" />
            </template>
            <template v-slot:item.statusIcon="{value}">
                <i class="material-icons">{{value}}</i>
            </template>
        </v-data-table>
    </div>
</div>
</template>

<script>
export default {
  props: {
    clients: { required: true, type: Array }
  },
  data() {
    return {
      headers: [
        { text: "Name", value: "name", align: "left",  },
        { text: "Models", value: "models", align: "left" },
      ],
    };
  },
  methods: {
      handleClick(value) {
          this.$emit("clientSelect", value)
      }
  }
};
</script>

<style lang="scss">
#table {
  max-height: 70vh;
  overflow: auto;
  width: 80vw;
}
.v-data-footer {
  display: none !important;
}


th {
  text-align: start;
}
</style>