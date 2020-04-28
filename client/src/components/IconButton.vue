<template>
    <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-btn icon dark v-on="on">
                <v-icon class="iconColor">{{icon}}</v-icon>
            </v-btn>
        </template>
        <span>{{tooltip}}</span>
    </v-tooltip>
</template>

<script>
export default {
    props: {
        tooltip: { type: String, required: true },
        icon: { type: String, required: true }
    }
};
</script>