<script>
  import { Route } from "svelte-navigator";
  import RouteGuard from "./RouteGuard.svelte";

  export let path;
  export let component;

</script>

<Route {path}>
  <RouteGuard {path}>
    <svelte:component this={component} />
  </RouteGuard>
</Route>
