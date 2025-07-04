<script setup lang="ts">
import ColorPicker from "@/ColorPicker.vue";
import {onMounted, ref} from "vue";
import {type HSLRGBA, hslrgbaFrom} from "@/util/hslrgba.ts";
import {colord} from "colord";

const picker1Color = ref<HSLRGBA>(hslrgbaFrom({r: 0, g: 0, b: 255}));
const picker2Color = ref<HSLRGBA>(hslrgbaFrom({r: 0, g: 128, b: 0, a: 0.5}));
const picker3Color = ref<HSLRGBA>(hslrgbaFrom({r: 0, g: 0, b: 0}));

onMounted(() => {
	setInterval(() => picker3Color.value = hslrgbaFrom({
			h: Math.floor(Math.random() * 360),
			s: Math.floor(Math.random() * 100),
			l: Math.floor(Math.random() * 100),
			a: 0.5 + Math.random() * 0.5,
		})
		, 3000);
});
</script>

<template>
	<h1>Color Picker Demo</h1>

	<h2 :style="{color: colord(picker1Color).toRgbString()}">No Alpha</h2>
	<ColorPicker v-model:color="picker1Color"/>

	<h2 :style="{color: colord(picker2Color).toRgbString()}">With alpha</h2>
	<ColorPicker with-alpha v-model:color="picker2Color"/>

	<h2 :style="{color: colord(picker3Color).toRgbString()}">Randomly updated (via props) every 3 seconds</h2>
	<ColorPicker with-alpha v-model:color="picker3Color"/>

</template>
