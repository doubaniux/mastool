<script>
	import "bulma/css/bulma.min.css";
	import { Router, Route } from "svelte-navigator";
	import Navbar from "./components/Navbar.svelte";
	import OAuthCallbackHandler from "./components/OAuthCallbackHandler.svelte";
	import ProtectedRoute from "./components/ProtectedRoute.svelte";
	import Relationship from "./pages/Relationship.svelte";
	import Authentication from "./pages/Authentication.svelte";
	import NotFound404 from "./pages/NotFound404.svelte";
	import {
		RELATIONSHIP,
		OAUTH_CALLBACK,
		AUTHENTICATION,
	} from "./routes";

</script>

<main class="">
	<Router>
		<Navbar />
		<ProtectedRoute path="/" component={Relationship} />
		<ProtectedRoute path={RELATIONSHIP} component={Relationship} />
		<Route path={OAUTH_CALLBACK} component={OAuthCallbackHandler} />
		<Route path={AUTHENTICATION} component={Authentication} />
		<Route path='*' component={NotFound404} />
	</Router>
</main>
