<template>
    <div>
        <v-dialog v-model="open" width="400px">
            <div class="card flexcol">
                <h2>{{title}}</h2>
                <p v-if="text != ''">{{text}}</p>
                <div class="flexrow buttons">
                    <v-btn @click="click"  class="confirm" rounded outlined 
                    small>Confirm</v-btn>
                    <v-btn  @click="$emit('closedialog')" rounded color="#1FB1A9" small dark>Cancel</v-btn>
                </div>
            </div>
        </v-dialog>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        click: {required: true},
        title: {type: String},
        text: {type: String},
        open: {type: Boolean}
    },
}
</script>

<style lang="scss" scoped>
.buttons > * {
    margin-right: 10px;
}
// added to make "confirm" button outlined
.confirm {
	background-color: white  !important;
	color:#1FB1A9;
	border: 1px solid #1FB1A9;
}
.flexrow{
	margin-top: 10px
}
</style>