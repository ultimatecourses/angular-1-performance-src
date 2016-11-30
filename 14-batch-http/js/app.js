angular
	.module('app', [])
	.config(function ($httpProvider) {
		$httpProvider.useApplyAsync(true);
	});
