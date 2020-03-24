<template>
    <div id="login">
        <div class="flexrow">
            <img src="charpstar.png" id="logo" />
        </div>
        <v-text-field label="email" v-model="email" />
        <v-text-field
            label="password"
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            @keydown="buttonPress"
        />
        <v-btn @click="login" :loading="loading" >Login</v-btn>

    </div>
</template>

<script>
import backend from ".././backend";

export default {
    data() {
        return {
            email: "",
            password: "",
            showPassword: false,
            loading: false
        };
    },
    name: "login",
    methods: {
        login() {
            var vm = this;
            vm.loading = true;
            backend.login(vm.email, vm.password).then(data => {
                vm.$emit("login", data);
                vm.loading = false
            });
        },
        buttonPress(button) {
            if (button.key == "Enter") {
                this.login()
            }
        }
    }
};
</script>

<style lang="scss" scoped>
#login {
    display: flex;
    flex-direction: column;
    margin: 10px;
}

#logo {
    max-width: 100px;
    margin-bottom: 20px;
}

h1 {
    font-size: 60px;
    font-weight: normal;
    text-align: center;
}
</style>