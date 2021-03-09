<template>
    <div>
        <div class="flexrow">
            <model-viewer
                :src="value.model"
                interaction-prompt="none"
                camera-controls
                id="viewer"
                v-bind:style="{opacity: value.model == '' ? 0 : 100}"
                @model-visibility="onModelLoad"
            ></model-viewer>
        </div>
        <v-file-input :label="value.label" @change="onFileChange" color="#1FB1A9"></v-file-input>
    </div>
</template>

<script>
export default {
    props: {
        value: { type: Object, required: true }
    },
    methods: {
        onFileChange(file) {
            var vm = this;
            if (file) {
                vm.value.file = file
                var reader = new FileReader();
                reader.onload = e => {
                    vm.value.model = e.target.result
                };
                reader.readAsDataURL(file);
            } else {
                vm.value.file = false;
                vm.value.model = "";
                vm.value.image = "";
            }
        },
        onModelLoad(event) {
            var vm = this;
            if (event.detail.visible) {
                event.target.toBlob().then(blob => {
                     vm.value.image = blob
                })
            }
        }
    }
};
</script>

<style lang="scss" scoped>
#viewer {
    width: 400px;
    height: 400px;
    margin-bottom: 10px;
}
</style>