<template>
    <div>
        <v-dialog v-model="handler.modal" width="400px">
            <div class="card flexcol">
                <h2>{{title}}</h2>
                <p v-if="text != ''" class="text">{{text}}</p>
                <div class="flexrow buttons">
                    <v-btn class="confirm" :loading="handler.loading" @click="handler.execute" rounded outlined 
                    small>Confirm</v-btn>
                    <v-btn @click="handler.modal = false" rounded color="#1FB1A9" small dark >Cancel</v-btn>
                </div>
                <p class="error-text" v-if="handler.error">{{handler.error}}</p>
            </div>
        </v-dialog>
        <v-btn rounded class="white--text" dark small @click="handler.modal=true" :style="{'background-color': color + ' !important'}">{{buttonText}}<v-icon right v-if="icon">{{icon}}</v-icon></v-btn>
    </div>
</template>

<script>
export default {
    props: {
        handler: {type: Object, required: true},
        title: {type: String, required: true},
        buttonText: {type: String, required: true},
        text: {type: String, required: false, default: ''},
        icon: {default: false},
        color: {default: ''},
    }
}
</script>

<style lang="scss" scoped>
.buttons > * {
    margin-right: 10px;
}
.text {
    padding: 10px;
}
// added to make "confirm" button outlined
.confirm {
	background-color: white  !important;
	color:#1FB1A9;
	border: 1px solid #1FB1A9;
}


.v-btn {
   padding-top: 20px !important;
   padding-bottom: 20px !important;
}
// added margin-top for butttons
.flexrow{
	margin-top: 10px;

}
</style>