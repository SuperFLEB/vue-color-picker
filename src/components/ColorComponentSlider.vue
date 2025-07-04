<script setup lang="ts">
import ColorComponentInput, {type ColorComponent} from "@/components/ColorComponentInput.vue";
import type {HSLRGBA} from "@/util/hslrgba.ts";
import {computed} from "vue";

type Props = { component: ColorComponent, orientation?: "vertical" | "horizontal", flipPointer?: boolean };
const props = withDefaults(defineProps<Props>(), {orientation: "horizontal", flipPointer: false});
const color = defineModel<HSLRGBA>("color", {required: true});

const gradientStops = computed<string[]>(() => {
	switch (props.component) {
		case "r":
			return ["srgb", "#000", "#f00"];
		case "g":
			return ["srgb", "#000", "#0f0"];
		case "b":
			return ["srgb", "#000", "#00f"];
		case "h":
			return ["hsl longer hue", "hsl(0deg, 100%, 50%)", "hsl(360deg, 100%, 50%)"];
		case "s":
			return ["srgb", "#7f7f7f", `hsl(${color.value.h}deg, 100%, ${color.value.l}%)`];
		case "l":
			return ["srgb", "#000", `rgb(${color.value.r}, ${color.value.g}, ${color.value.b})`, "#fff"];
		case "a":
			return ["srgb", `rgba(${color.value.r}, ${color.value.g}, ${color.value.b}, 0)`, `rgba(${color.value.r}, ${color.value.g}, ${color.value.b}, 1)`];
		default:
			return ["srgb", "#000", "#fff"];
	}
});

const background = computed<string>(() => {
	const [mode, ...stops] = gradientStops.value;
	const direction = props.orientation === "horizontal" ? "right" : "top";
	return `linear-gradient(to ${direction} in ${mode}, ${stops.join(",")})`;
});
</script>

<template>
	<ColorComponentInput :class="['slider', props.orientation, {flip: props.flipPointer}]" :style="{'--slider-background': background}" :component="props.component" v-model:color="color" type="range"/>
</template>

<style scoped lang="scss">
@use "../range.scss" as r;

.slider.flip {
	transform: scaleY(-1) translateY(0.25em);
}

.slider.vertical {
	writing-mode: vertical-lr;
	direction: rtl;
	@include r.thumb {
		transform-origin: center;
		transform: rotate(90deg) translateY(0.25em);
	}
}

.slider {
	font-size: inherit;
	@include r.reset;
	@include r.track {
		background: var(--slider-background), var(--checker);
		block-size: 0.5em;
		margin-block: 0.25em;
		border-radius: .5em;
	}
	@include r.thumb {
		width: 0.75em;
		aspect-ratio: 1 / 1;
		background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 2 2"><path d="M0 2h2L1 0Z" fill="none" stroke-width=".5" stroke="%23000"/></svg>');
		background-size: 100% 100%;
		background-color: #fff;
		background-position: center;
		clip-path: polygon(0 100%, 100% 100%, 50% 0);
	}
}
</style>