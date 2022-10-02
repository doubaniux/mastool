<script>
	import "bulma/css/bulma.min.css";
	import { Router, Route } from "svelte-navigator";
	import Navbar from "./components/Navbar.svelte";
	import OAuthCallbackHandler from "./components/OAuthCallbackHandler.svelte";
	import ProtectedRoute from "./components/ProtectedRoute.svelte";
	import Relationship from "./pages/Relationship.svelte";
	import DeleteToots from "./pages/DeleteToots.svelte";
	import Authentication from "./pages/Authentication.svelte";
	import NotFound404 from "./pages/NotFound404.svelte";
	import {
		RELATIONSHIP,
		OAUTH_CALLBACK,
		AUTHENTICATION,
		DELETE_TOOTS,
	} from "./routes";
	import { accessToken } from "./store";
	import * as i18n from "./i18n";
	import { login } from "./auth";
	import LoadingOverlay from "./components/LoadingOverlay.svelte";

	let isReady = false;

	const localAccessToken = localStorage.getItem("accessToken");
	const localDomain = localStorage.getItem("domain");

	if (localAccessToken && localDomain) {
		login(localDomain, localAccessToken)
			.then((result) => {
				if (result) accessToken.set(localAccessToken);
			})
			.finally(() => {
				isReady = true;
			});
	} else {
		isReady = true;
	}
</script>

<main class="">
	<Router>
		<Navbar />
		{#if !isReady}
			<LoadingOverlay />
		{/if}
		<ProtectedRoute path="/" component={Relationship} />
		<ProtectedRoute path={RELATIONSHIP} component={Relationship} />
		<ProtectedRoute path={DELETE_TOOTS} component={DeleteToots} />
		<Route path={OAUTH_CALLBACK} component={OAuthCallbackHandler} />
		<Route path={AUTHENTICATION} component={Authentication} />
		<Route path="*" component={NotFound404} />
	</Router>
</main>
