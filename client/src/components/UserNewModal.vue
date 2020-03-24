<template>
    <v-dialog v-model="open" @click:outside="close" width="500">
        <div class="card">
            <h2>New User</h2>
            <v-form v-model="valid">
                <v-text-field v-model="name" label="Name" :rules="nameRules"></v-text-field>
                <v-text-field v-model="email" label="Email" :rules="emailRules"></v-text-field>
                <v-select :items="accountTypes" label="Type" v-model="type"></v-select>
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
                'Client', 'Modeler', 'QA', 'Admin' 
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
            type: 'Client',
            valid: false,
        };
    },
    methods: {
        newUser() {
            var vm = this
            vm.loading = true
            backend.newUser(vm.name, vm.email, vm.type).then(val => {
                vm.loading = false
                vm.name = ""
                vm.email = ""
                vm.type = 'Client'
                vm.$emit('newuser', val)
            })
        },
        close() {
            var vm = this
            vm.name = ""
            vm.email = ""
            vm.type = 'Client'
            vm.$emit('close')
        }
    }
};
</script>