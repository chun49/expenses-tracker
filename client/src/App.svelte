<script>
  import Router from "svelte-spa-router";
import Dashboard from "./pages/Dashboard.svelte";
  import Home from "./pages/Home.svelte";
import Signup from "./pages/Signup.svelte";
  const routes = {
    "/": Home,
    "/dashboard" : Dashboard,
    "/signup" : Signup
  };
</script>

<Router {routes} />
