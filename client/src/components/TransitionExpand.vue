<template>
    <transitionExpandHeight>
        <transitionExpandWidth>
            <slot />
        </transitionExpandWidth>
    </transitionExpandHeight>
</template>

<script>
import transitionExpandWidth from "./TransitionExpandWidth";
import transitionExpandHeight from "./TransitionExpandHeight";

export default {
    name: "transitionExpand",
    components: {
        transitionExpandWidth,
        transitionExpandHeight
    }
};
</script>