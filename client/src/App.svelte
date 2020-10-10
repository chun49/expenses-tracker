<script>
  import Axios from "axios";
  import { onMount } from "svelte";
  import Router, { wrap, push } from "svelte-spa-router";
  import Loading from "./components/Loading.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import Home from "./pages/Home.svelte";
  import Login from "./pages/Login.svelte";
  import Signup from "./pages/Signup.svelte";
  import { user } from "./stores";
  let loading = true;
  onMount(async () => {
    const { data } = await Axios.get("/api/auth/user");
    $user = data.user;
    loading = false;
  });
  const routes = {
    "/": wrap(Home, { reason: "authenticated" }, () => !$user),
    "/dashboard": wrap(Dashboard, { reason: "unauthenticated" }, () => $user),
    "/signup": wrap(Signup, { reason: "authenticated" }, () => !$user),
    "/login": wrap(Login, { reason: "authenticated" }, () => !$user),
  };
  function conditionsFailed(e) {
    const reason = e.detail.userData;
    console.log(reason);
    if (reason === "unauthenticated") {
      return push("/signup");
    } else {
      return push("/dashboard");
    }
  }
</script>

<style>
  .loading-container {
    max-width: 500px;
    display: flex;
    min-height: 100vh;
    margin: auto;
    align-content: center;
  }
</style>

{#if loading}
  <div class="loading-container">
    <Loading />
  </div>
{:else}
  <Router {routes} on:conditionsFailed={conditionsFailed} />
{/if}
