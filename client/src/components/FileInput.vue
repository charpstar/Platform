<template>
    <v-file-input :label="label" @change="onFileChange"></v-file-input>
</template>

<script>
export default {
    props: {
        label: { type: String, required: true }
    },
    methods: {
        onFileChange(file) {
            var vm = this;
            if (file) {
                var reader = new FileReader();
                reader.onload = e => {
                    vm.$emit("file", e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                vm.$emit("file", false);
            }
        }
    }
};
</script>