<template>
    <div id="login">
        <div class="flexrow">
            <img src="charpstar2.png" id="logo" />
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
        <transitionexpandheight>
            <p class="error" v-if="button.error">{{button.error}}</p>
        </transitionexpandheight>
        <v-btn @click="button.execute" :loading="button.loading" :disabled="!email || !password">Login</v-btn>
    </div>
</template>

<script>
import backend from ".././backend";
import transitionexpandheight from "./TransitionExpandHeight";

export default {
    components: {
        transitionexpandheight
    },
    data() {
        return {
            email: "",
            password: "",
            showPassword: false,
            button: backend.promiseHandler(this.login)
        };
    },
    methods: {
        login() {
            var vm = this;
            return backend.login(vm.email.toLowerCase(), vm.password)
                .then(userData => {
                    vm.$emit("login", userData);
                })
        },
        buttonPress(button) {
            if (button.key == "Enter") {
                this.button.execute();
            }
        }
    },
    mounted() {
        var vm = this;
        backend.relogin().then(userData => {
            vm.$emit("login", userData);
        })
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
    max-width: 150px;
    margin-bottom: 20px;
}

h1 {
    font-size: 60px;
    font-weight: normal;
    text-align: center;
}

.error {
    color: #d12300 !important;
    margin-bottom: 5px;
    max-width: 200px;
}
.v-btn {
    margin-top: 10px;
}
</style>