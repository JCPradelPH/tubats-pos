// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	isMockEnabled: true, // You have to switch this, when your real back-end is done
	authTokenKey: 'authce9d77b308c149d5992a80073637e4d5',
	firebase: {
		apiKey: "AIzaSyBDAIpCteK1FGN1-RnOX9MhRMwt3cVAhvY",
		authDomain: "tubats-restobar-pos.firebaseapp.com",
		databaseURL: "https://tubats-restobar-pos.firebaseio.com",
		projectId: "tubats-restobar-pos",
		storageBucket: "tubats-restobar-pos.appspot.com",
		messagingSenderId: "68554797993",
		appId: "1:68554797993:web:7c79bd0c63e4a4c8"
	}
};
