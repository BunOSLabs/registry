import { Hono } from "hono";

const app = new Hono();

app.get("/:packageQuery", (c) => {
	const { packageQuery } = c.req.param();

	const packageName = packageQuery.includes(".")
		? packageQuery.substring(0, packageQuery.indexOf(".") - 1)
		: packageQuery;

	return c.json({
		_attachments: {},
		_id: packageName,
		_rev: "00a603b57e0dd6e7474fe04030e715989634cb8ecf8118487ec6f72bee66d8f1",
		author: {
		},
		description: "Test package",
		"dist-tags": {
			"latest": "0.0.1"
		},
		license: "GPL",
		maintainers: [],
		name: packageName,
		readme: `# ${packageName}`,
		time: {
			"0.0.1": "2015-03-24T00:12:24.039Z",
			"created": "2015-03-24T00:12:24.039Z",
			"modified": "2015-03-24T00:12:24.039Z",
		},
		versions: {
			"0.0.1": {
				"_from": ".",
				"_id": `${packageName}@0.0.1`,
				"_npmUser": {
				},
				"_npmVersion": "2.7.0",
				"_shasum": "248b4b3c77a6582a8438fbc27511af379033b17d",
				"author": {
				},
				"description": "Test package",
				"directories": {},
				"dist": {
					"shasum": "248b4b3c77a6582a8438fbc27511af379033b17d",
					"tarball": "https://europe.mirror.pkgbuild.com/core/os/x86_64/glibc-2.38-7-x86_64.pkg.tar.zst"
				},
				"license": "GPL",
				"maintainers": [
				],
				"name": packageName,
				"scripts": {
				},
				"version": "0.0.1"
			}
		},
	});
});

export default {
	port: process.env.PORT ?? 6969,
	hostname: "[::]",
	fetch: app.fetch,
};
