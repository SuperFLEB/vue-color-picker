<script setup lang="ts">
import {HSLAOrRGBA, type HSLRGBA, hslrgbaUpdate} from "@/util/hslrgba.ts";

const color = defineModel<HSLRGBA>("color", {required: true});

function setColor(components: Partial<HSLAOrRGBA>) {
	color.value = hslrgbaUpdate(color.value, components);
}
</script>

<template>
	<ul class="swatches">
		<li v-for="swatchColor in [
				{ h: color.h, s: 100, l: 50 },
				{ h: color.h, s: color.s, l: 50 },
				{ h: color.h, s: 100, l: color.l },
				{ h: color.h, s: 0, l: 0 },
				{ h: color.h, s: 0, l: 50 },
				{ h: color.h, s: 0, l: 100 },
			]">
			<button class="swatch" type="button" @click="setColor(swatchColor)"
					:style="{'--swatch-color': `hsl(${swatchColor.h}deg,${swatchColor.s}%,${swatchColor.l}%)`}"></button>
		</li>
	</ul>
</template>

<style scoped lang="scss">

.swatches {
	grid-area: swatches;
	display: grid;
	gap: 0.25ch;
	margin: 0;
	padding: 0;
	list-style-type: none;

	li, button {
		display: block;
	}

	button {
		appearance: none;
		height: calc(100% - 0.25ch);
		border: 0 none;
		background-color: transparent;
		border: 1px solid #7f7f7f;
		aspect-ratio: 1 / 1;
		padding: 0;
		margin: 0;
		position: relative;

		&:before {
			content: " ";
			position: absolute;
			inset: 0;
			background-color: var(--swatch-color);
		}

		&:focus:after {
			content: " ";
			position: absolute;
			inset: 0;
			border: 2px solid #ccc;
			mix-blend-mode: difference;
		}
	}
}

</style>