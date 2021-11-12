<script>
  import { navigate } from "svelte-navigator";
  import { userLoggedIn } from "../store";
  import { AUTHENTICATION } from "../routes";

  $: if (!$userLoggedIn) {
    navigate(AUTHENTICATION);
  }
</script>

{#if $userLoggedIn}
  <slot />
{/if}
