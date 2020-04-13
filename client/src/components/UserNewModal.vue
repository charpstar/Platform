<template>
    <v-dialog v-model="open" @click:outside="close" width="500">
        <div class="card">
            <h2>New User</h2>
            <v-form v-model="valid">
                <v-text-field v-model="name" label="Name" :rules="nameRules"></v-text-field>
                <v-text-field v-model="email" label="Email" :rules="emailRules"></v-text-field>
                <v-select :items="accountTypes" label="Type" v-model="usertype"></v-select>
                <p class="error" v-if="error != ''">{{error}}</p>
                <v-btn :loading="loading" :disabled="!valid" @click="newUser">Create</v-btn>
            </v-form>
        </div>
    </v-dialog>
</template>

<script>
import backend from '../backend'

export default {
    props: {
        open: {type: Boolean, required: true}
    },
    data() {
        return {
            accountTypes: [
                'Client', 'Modeller', 'QA', 'Admin' 
            ],
            nameRules: [
                v => !!v || 'Name is required',
            ],
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
            loading: false,
            name: "",
            email: "",
            usertype: 'Client',
            valid: false,
            error: ''
        };
    },
    methods: {
        newUser() {
            var vm = this
            vm.loading = true
            var userObj = {
                name: vm.name,
                email: vm.email,
                usertype: vm.usertype
            }
            backend.newUser(userObj).then(newUser => {
                backend.postIdFix(newUser.email).then(id => {
                    newUser.userid = id
                    vm.loading = false
                    vm.name = ""
                    vm.email = ""
                    vm.usertype = 'Client'
                    vm.$emit('newuser', newUser)
                })
                
            })
        },
        close() {
            var vm = this
            vm.name = ""
            vm.email = ""
            vm.usertype = 'Client'
            vm.$emit('close')
        }
    }
};
</script>

<style lang="scss" scoped>
.error {
    color: #d12300;
    margin-bottom: 5px;
}
</style>