<template>
<div>
    <div id="itemsView">
        <v-data-table id="table" :headers="headers" :items="items" :items-per-page="-1" @click:row="handleClick">
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
    items: { required: true, type: Array }
  },
  data() {
    return {
      headers: [
        {
          text: "",
          align: "left",
          sortable: false,
          value: "icon"
        },
        { text: "Name", value: "name", align: "left" },
        { text: "Status", value: "status", align: "left" },
        { text: "", value: "statusIcon", align: "left", sortable: false }
      ],
      desserts: []
    };
  },
  methods: {
      handleClick(value) {
          this.$emit("view", value)
      }
  }
};
</script>

<style lang="scss">
#table {
  max-height: 70vh;
  overflow: auto;
  width: 70vw;
}
.v-data-footer {
  display: none !important;
}

.itemIcon {
  max-width: 50px;
}

</style>