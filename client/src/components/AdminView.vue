<template>
    <div>
        <div id="adminview" class="flexcol">
            <v-btn @click="$router.push('/admin/users')">View Users</v-btn>
            <v-btn @click="$router.push('/admin/orders')">View All Orders</v-btn>
            <v-btn @click="$router.push('/admin/models')">View All Models</v-btn>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.v-btn:not(:last-child) {
    margin-bottom: 10px;
}
</style>