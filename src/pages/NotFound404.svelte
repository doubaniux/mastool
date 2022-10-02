<script>
  import { _ } from 'svelte-i18n';
</script>
<section class="hero is-info is-medium">
  <div class="container">
    <div class="hero-body">
      <h1 class="title is-1">
        404
      </h1>
      <p class="subtitle">
        {$_('page.404_message', {default: 'Page Not Found'})}
      </p>
    </div>
  </div>
</section>

<style>
  h1 {
    text-align: center;
  }
</style>