<template>
    <div>
        <div class="flexrow">
            <model-viewer
                :src="value.model"
                interaction-prompt="none"
                camera-controls
                id="mv"
                v-bind:style="{opacity: value.model == '' ? 0 : 100}"
                @model-visibility="onModelLoad"
            ></model-viewer>
        </div>
        <fileInput :label="value.label" @file="onFileChange" />
    </div>
</template>

<script>
import fileInput from "./FileInput";
export default {
    components: {
        fileInput
    },
    props: {
        value: { type: Object, required: true }
    },
    methods: {
        onFileChange(file) {
            var vm = this;
            if (file) {
                vm.value.model = file;
            } else {
                vm.value.model = "";
                vm.value.image = "";
            }
        },
        onModelLoad(event) {
            var vm = this;
            if (event.detail.visible) {
                vm.value.image = event.target.toDataURL("image/png");
            }
        }
    }
};
</script>

<style lang="scss" scoped>
img {
    height: 100px;
}

#mv {
    width: 150px;
    height: 150px;
    margin-bottom: 10px;
}
</style>