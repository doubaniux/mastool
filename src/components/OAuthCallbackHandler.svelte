<script>
  import { _ } from 'svelte-i18n';
  const urlParams = new URLSearchParams(window.location.search);
  window.opener.postMessage({code: urlParams.get('code')}, '*');
</script>

<section class="section center">
  <p class="content">
    {$_('component.oauth_callback_message', {default: 'Redirecting you back to the application...'})}
  </p>
</section>

<style>
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>