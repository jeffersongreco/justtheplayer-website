import { mount } from "svelte";
import App from "./App.svelte";

// biome-ignore lint/style/noNonNullAssertion: dev-only entry point, #app always exists in index.html
mount(App, { target: document.getElementById("app")! });
