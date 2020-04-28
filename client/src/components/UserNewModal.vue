<template>
    <v-dialog v-model="handler.modal" width="500">
        <div class="card">
            <h2>New User</h2>
            <v-form v-model="valid">
                <v-text-field v-model="name" label="Name" :rules="nameRules"></v-text-field>
                <v-text-field v-model="email" label="Email" :rules="emailRules"></v-text-field>
                <v-select :items="accountTypes" label="Type" v-model="usertype"></v-select>
                <p class="error-text" v-if="handler.error">{{handler.error}}</p>
                <v-btn :loading="handler.loading" :disabled="!valid" @click="handler.execute">Create</v-btn>
            </v-form>
        </div>
    </v-dialog>
</template>

<script>
import backend from "../backend";

export default {
    props: {
        handler: { type: Object, required: true }
    },
    data() {
        return {
            accountTypes: ["Client", "Modeller", "QA", "Admin"],
            nameRules: [v => !!v || "Name is required"],
            emailRules: [
                v => !!v || "E-mail is required",
                v => /.+@.+/.test(v) || "E-mail must be valid"
            ],
            name: "",
            email: "",
            usertype: "Client",
            valid: false
        };
    },
    methods: {
        newUser() {
            var vm = this;
            var userObj = {
                name: vm.name,
                email: vm.email,
                usertype: vm.usertype
            };
            return backend.newUser(userObj).then(newUser => {
                vm.$emit("newuser", newUser);
                vm.close();
            });
        },
        close() {
            var vm = this;
            vm.name = "";
            vm.email = "";
            vm.usertype = "Client";
        }
    },
    mounted() {
        this.handler.fun = this.newUser;
    }
};
</script>
