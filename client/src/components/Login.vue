<template>
<div>
    <div id="login">
        <h1>Welcome!</h1>
        
        <v-text-field label="email" v-model="email"/>
        <v-text-field label="password" v-model="password"/>
        <v-btn @click="login">Login</v-btn>
    </div>
</div>
</template>

<script>

import backend from ".././backend"

export default {
    data() {return {
        email: "",
        password: ""
    }},
    name: 'login',
    methods: {
        login() {
            var vm = this
            backend.login(vm.email, vm.password).then((data) => {
                vm.$emit('login', data)
            })
        }
    }
}
</script>

<style lang="scss">
#login {
    display: flex;
    flex-direction: column;
}

h1 {
    font-size: 60px;
    font-weight: normal;
    text-align: center;
}
</style>