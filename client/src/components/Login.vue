<template>
<div>
    <div id="login">
        <h1>Welcome!</h1>
        
        <v-text-field label="email"/>
        <v-text-field label="password"/>
        <v-btn @click="$emit('login')">Login</v-btn>
    </div>
</div>
</template>

<script>

export default {
    name: 'login'
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