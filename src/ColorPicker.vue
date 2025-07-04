<script setup lang="ts">
import {computed, watch} from "vue";
import {type Colord, type HslaColor, type HslColor, type RgbaColor, type RgbColor} from "colord";
import RandomNamespace from "@superfleb/random/namespace";
import {type HSLRGBA, hslrgbaFrom} from "@/util/hslrgba.ts";
import ColorComponentInput from "@/components/ColorComponentInput.vue";
import CurrentColorSwatch from "@/components/CurrentColorSwatch.vue";
import RainbowDisplay from "@/components/RainbowDisplay.vue";
import ColorComponentSlider from "@/components/ColorComponentSlider.vue";
import RelatedSwatches from "@/components/RelatedSwatches.vue";

type Props = { withAlpha?: boolean };
const props = withDefaults(defineProps<Props>(), {withAlpha: false});

const colorModel = defineModel<HSLRGBA | HslColor | HslaColor | RgbColor | RgbaColor | Colord>("color", {
	default: () => hslrgbaFrom({r: 255, g: 255, b: 255})
});

const color = computed<HSLRGBA>({
	get() {
		return colorModel.value as HSLRGBA;
	},
	set(value) {
		colorModel.value = hslrgbaFrom(value);
	}
});

// Turn the colors from colorModel into the RGBHSLA objects that color needs.
watch(colorModel, (is, was) => {
	if (JSON.stringify(was) === JSON.stringify(is)) return;
	color.value = hslrgbaFrom(is);
}, {immediate: true});

const ns = new RandomNamespace();
</script>

<template>
	<div class="colorPicker">
		<RelatedSwatches v-model:color="color"/>
		<RainbowDisplay v-model:color="color"/>

		<ColorComponentSlider class="slider hue" component="h" v-model:color="color" flip-pointer/>

		<ColorComponentSlider class="slider sat" orientation="vertical" component="s" v-model:color="color"/>
		<ColorComponentSlider class="slider lum" orientation="vertical" component="l" v-model:color="color"/>
		<ColorComponentSlider v-if="props.withAlpha" orientation="vertical" class="slider alpha" component="a"
							  v-model:color="color"/>
		<div v-else style="display: none"></div>

		<div class="rgbSliders">
			<ColorComponentSlider class="slider red" component="r" v-model:color="color"/>
			<ColorComponentSlider class="slider green" component="g" v-model:color="color"/>
			<ColorComponentSlider class="slider blue" component="b" v-model:color="color"/>
		</div>
		<div class="inputs">
			<ul class="rgbInputs">
				<li v-for="component in ['r','g','b'] as const">
					<label :for="ns.id(`typein_${component}`)">{{ component.toUpperCase() }}:</label>
					<ColorComponentInput :id="ns.id(`typein_${component}`)" type="number" :component
										 v-model:color="color"/>
				</li>
				<li v-if="props.withAlpha"><label :for="ns.id(`typein_a`)">A:</label>
					<ColorComponentInput :id="ns.id(`typein_a`)" type="number" component="a" v-model:color="color"/>
				</li>
			</ul>
			<ul class="hslInputs">
				<li v-for="component in ['h','s','l'] as const">
					<label :for="ns.id(`typein_${component}`)">{{ component.toUpperCase() }}:</label>
					<ColorComponentInput :id="ns.id(`typein_${component}`)" type="number" :component
										 v-model:color="color"/>
				</li>
			</ul>
			<div class="hexInput">
				<label :for="ns.id('typein_hex')">#</label>
				<input type="text" maxlength="6"/>
			</div>
		</div>
		<div class="currentSwatch">
			<CurrentColorSwatch :color orientation="vertical"/>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "./range.scss" as r;

.colorPicker {
	--checker: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path d="M0,0h1v2h1V1H0Z" fill="%23888"/></svg>');
}

.colorPicker {
	display: grid;
	gap: 0 1ch;
	grid-template-columns: min-content min-content min-content min-content min-content min-content min-content fit-content(5em);
	grid-template-areas:
		".        h       . . . .      ."
		"swatches display l s a inputs swatch"
		".        rgb     . . . .      ."
}

.display {
	grid-area: display;
}

.slider.hue {
	grid-area: h;
}

.slider.sat {
	grid-area: s;
	height: 100px;
}

.slider.lum {
	grid-area: l;
	height: 100px;
}

.slider.alpha {
	grid-area: a;
	height: 100px;
}

.rgbSliders {
	grid-area: rgb;
	align-self: start;
	display: flex;
	flex-direction: row;

	.slider {
		width: 33%;
	}
}

.inputs {
	grid-area: inputs;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-auto-rows: min-content;
	gap: 0.25em 1ch;
	font-size: 0.8em;

	.rgbInputs, .hslInputs {
		margin: 0;
		padding: 0;
		list-style: none;

		li {
			display: grid;
			margin-bottom: 0.25ch;
			grid-template-columns: 1em 1fr;
			gap: 1ch;
		}
	}

	input {
		font: inherit;
		padding: 0;
		width: 3em;
	}

	.hexInput {
		grid-column: 1 / 3;
		display: grid;
		grid-template-columns: 1em auto;
		gap: 1ch;

		input {
			box-sizing: border-box;
			width: 100%;
		}
	}
}

.currentSwatch {
	grid-area: swatch;
	background-image: var(--checker);
	background-size: .75em;
	position: relative;
	top: 10%;
	height: 60%;
	margin-left: 20%;
	aspect-ratio: 1 / 1;
	overflow: hidden;
	clip-path: circle(50% at 50% 50%);

	& > * {
		transform: rotateZ(-45deg);
	}
}
</style>