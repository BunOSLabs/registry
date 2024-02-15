import { Hono } from "hono";

const hasher = new Bun.CryptoHasher("sha1");
const app = new Hono();

const arch = `x86_64`;

const fetchArchPackageMeta = async (packageName: string, repo?: string) => {
	const repository = repo ?? "core";
	const mirror = `https://europe.mirror.pkgbuild.com/${repository}/os/${arch}`;
	const archLinuxUri = `https://archlinux.org/packages/${repository}/${arch}/${packageName.replace(
		"@archlinux/",
		"",
	)}/json`;
	const response = await fetch(archLinuxUri);
	const archLinuxJson = (await response.json()) as any;

	const tarballUrl = `${mirror}/${archLinuxJson.filename}`;

	const temp = await fetch(tarballUrl);
	hasher.update(await temp.arrayBuffer());
	const hash = hasher.digest("hex");
	console.log(tarballUrl, hash);

	const packageDescription: string = archLinuxJson.pkgdesc;
	const packageVersion: string = `${archLinuxJson.pkgver}.${archLinuxJson.pkgrel}`;

	return {
		_attachments: {},
		_id: packageName,
		_rev: "00a603b57e0dd6e7474fe04030e715989634cb8ecf8118487ec6f72bee66d8f1",
		author: {},
		description: packageDescription,
		"dist-tags": {
			latest: packageVersion,
		},
		license: "GPL",
		maintainers: [],
		name: packageName,
		readme: `# ${packageName}\n${packageDescription}`,
		time: {
			[packageVersion]: "2015-03-24T00:12:24.039Z",
			created: "2015-03-24T00:12:24.039Z",
			modified: "2015-03-24T00:12:24.039Z",
		},
		versions: {
			[packageVersion]: {
				_from: ".",
				_id: `${packageName}@${packageVersion}`,
				_npmUser: {},
				_npmVersion: "2.7.0",
				_shasum: hash,
				author: {},
				description: packageDescription,
				directories: {},
				dist: {
					shasum: hash,
					tarball: tarballUrl,
				},
				license: "GPL",
				maintainers: [],
				name: packageName,
				scripts: {},
				version: packageVersion,
			},
		},
	};
};

app.get("/:packageQuery", async (c) => {
	const { packageQuery } = c.req.param();

	const packageName = packageQuery.includes(".")
		? packageQuery.substring(0, packageQuery.indexOf(".") - 1)
		: packageQuery;

	if (!packageName.startsWith("@archlinux"))
		return c.redirect(`https://registry.npmjs.org/${packageName}`);

	const packageMetadata = await fetchArchPackageMeta(packageName);

	return c.json(packageMetadata);
});

export default {
	port: process.env.PORT ?? 6969,
	hostname: "[::]",
	fetch: app.fetch,
};
