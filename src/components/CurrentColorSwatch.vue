<script setup lang="ts">
import type {HSLRGBA} from "@/util/hslrgba.ts";
import {computed} from "vue";
import {colord} from "colord";

type Props = { color: HSLRGBA, orientation?: "horizontal" | "vertical" };
const props = withDefaults(defineProps<Props>(), {orientation: "horizontal"});

const alphaColor = computed(() => colord({h: props.color.h, s: props.color.s, l: props.color.l, a: props.color.a}));
const flatColor = computed(() => alphaColor.value.alpha(1.0));
</script>

<template>
	<div :class="['ccSwatches', props.orientation, { split: props.color.a < 1 && props.color.a > 0}]">
		<div v-if="props.color.a > 0" class="flat" :title="flatColor.toRgbString()" :style="{'--swatch': flatColor.toRgbString()}"></div>
		<div v-if="props.color.a < 1" class="alpha" :title="alphaColor.toRgbString()"
			 :style="{'--swatch': alphaColor.toRgbString()}"></div>
	</div>
</template>

<style scoped lang="scss">
.ccSwatches {
	width: 100%;
	height: 100%;
}

.ccSwatches > div {
	background-color: var(--swatch);
	width: 100%;
	height: 100%;
}

.ccSwatches.split {
	display: grid;

	&.horizontal {
		grid-template-columns: 1fr 1fr;
	}

	&.vertical {
		grid-template-rows: 1fr 1fr;
	}
}

</style>