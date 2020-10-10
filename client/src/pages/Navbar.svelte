<script>
  import axios from "axios";
  import { user, transactions } from "../stores";
  import { push } from "svelte-spa-router";
  let isActive = false;
  async function logout() {
    await axios.post("/api/auth/logout");
    $user = null;
    $transactions = [];
    push("/");
  }
</script>

<nav class="navbar is-info">
  <div class="container">
    <div class="navbar-brand">
      <a href="/#" class="navbar-item title">💸</a>
      <span
        role="button"
        class:is-active={isActive}
        on:click={() => (isActive = !isActive)}
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </span>
    </div>
    <div class="navbar-menu" class:is-active={isActive}>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            {#if $user}
            <a href="#/profile" class="button is-primary is-light">👨 {$user.username}</a>
            <button class="button" on:click={logout}>Log out</button>
            {:else}
            <a href="#/login" class="button">Login</a>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
