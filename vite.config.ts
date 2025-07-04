import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "node:path";
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import packageJson from "./package.json" with { type: "json"};

function rxEsc(s: string): string {
	return s.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

// Externalize dependencies and peer dependencies from package.json
const external = [
	...Object.keys(packageJson.dependencies ?? {}),
	...Object.keys(packageJson.peerDependencies ?? {})]
	.map(d => new RegExp(`^${rxEsc(d)}(/|$)`));

const entries = "./src/ColorPicker.vue"; // globject(typeGlobs);
const CSS_NAME = "VectorDot";

export default defineConfig(() => (
	{
		appType: "mpa", // disable history fallback
		plugins: [
			vue(),
			libInjectCss(),
		],
		build: {
			// assetsInlineLimit: 0,
			minify: true,
			sourcemap: true,
			target: "es2020",
			lib: {
				entry: entries,
				cssFileName: CSS_NAME,
				formats: ["es"],
				fileName: (format, entryName) => {
					const baseName = entryName.replace(/\.(vue|ts|tsx)$/, "");
					return `${format}/${baseName}.mjs`;
				},
				name: "ColorPicker",
			},
			rollupOptions: {
				output: {
					chunkFileNames: (chunkInfo) => {
						const match = chunkInfo.moduleIds[0].match(/^(.+[/\\]([^?/\\]+))\.[^.?]*\?.*$/);
						if (!match) return chunkInfo.name + ".mjs";
						const outPath = path.relative("./src", match[1]);
						return outPath + ".mjs";
					},
					entryFileNames: `[name].mjs`,
				},
				external,
			}
		},
		resolve: {
			preserveSymlinks: true,
			alias: [
				{find: "@", replacement: path.resolve(__dirname, "./src")},
				{find: "@t", replacement: path.resolve(__dirname, "./src/types")},
			],
		}
	})
);

