<script>
  import { navigate } from "svelte-navigator";
  import { userLoggedIn } from "../store";
  import { AUTHENTICATION } from "../routes";

  export let path;

  $: if (!$userLoggedIn) {
    navigate(AUTHENTICATION + `?to=${path}`);
  }
</script>

{#if $userLoggedIn}
  <slot />
{/if}
