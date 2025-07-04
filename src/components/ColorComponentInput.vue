<script setup lang="ts">
import {computed} from "vue";
import {type HSLAOrRGBA, type HSLRGBA, hslrgbaFrom} from "@/util/hslrgba.ts";

export type ColorComponent = "h" | "s" | "l" | "r" | "g" | "b" | "a";

type Props = { component: ColorComponent, type?: "number" | "range" };
const props = withDefaults(defineProps<Props>(), { type: "range" });
const color = defineModel<HSLRGBA>("color",{required: true});

const componentModel = computed<HSLAOrRGBA>(() => "hsl".includes(props.component) ?
	{
		h: color.value.h,
		s: color.value.s,
		l: color.value.l,
		a: color.value.a
	} : {
		r: color.value.r,
		g: color.value.g,
		b: color.value.b,
		a: color.value.a
	});

const componentValue = computed(() => componentModel.value[props.component as keyof typeof componentModel.value]);
const max = computed(() => {
	if (props.component === "h") return "359";
	if (props.component === "s" || props.component === "l") return "100";
	if (props.component === "a") return "1";
	return "255";
});

const step = computed(() => props.component === "a" ? 0.01 : 1);

function updateModel(e: Event) {
	color.value = hslrgbaFrom({
		...componentModel.value,
		[props.component]: Number((e.target as HTMLInputElement).value)
	});
}
</script>

<template>
	<input :type="props.type" min="0" :max :step :value="componentValue" @input="updateModel"/>
</template>
