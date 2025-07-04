<script setup lang="ts">
import {colord} from "colord";
import RandomNamespace from "@superfleb/random/namespace";
import {type HSLRGBA, hslrgbaUpdate} from "@/util/hslrgba.ts";

const color = defineModel<HSLRGBA>("color", { required: true });
function pickDisplayColor(e: MouseEvent) {
	const target = (e.target as Element).getBoundingClientRect();
	const h = 360 * (e.clientX - target.x) / target.width;
	const l = 100 * (1 - (e.clientY - target.y) / target.height);
	color.value = hslrgbaUpdate(color.value, {h, l});
}

const ns = new RandomNamespace();
</script>

<template>
	<svg class="display" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 100" preserveAspectRatio="none"
		 width="400" height="100" @click="pickDisplayColor">
		<defs>
			<linearGradient :id="ns.id('lum')" x2="0%" y2="100%">
				<stop offset="0%" stop-color="#fff"/>
				<stop offset="50%" stop-color="rgba(255,255,255,0)"/>
				<stop offset="50%" stop-color="rgba(0,0,0,0)"/>
				<stop offset="100%" stop-color="#000"/>
			</linearGradient>
			<linearGradient :id="ns.id('hue')" x2="100%">
				<stop v-for="index in 7" :key="index" :offset="(index - 1) / .06 + '%'"
					  :stop-color="colord({h: (index - 1) * 60, s: color.s, l: 50 }).toHex()"/>
			</linearGradient>
			<path :id="ns.id('fill')" d="M 0 0 h 360 v 100 H 0 Z"/>
		</defs>
		<path d="M 0 0 h 360 v 100 H 0 Z" :fill="ns.url('hue')"/>
		<use :href="ns.fragment('fill')" :fill="ns.url('lum')"/>
		<circle :cx="color.h" :cy="100 - color.l" r="4" stroke="#fff" stroke-width="2" fill="none"
				style="mix-blend-mode: difference"/>
	</svg>
</template>

<style scoped lang="scss">

</style>