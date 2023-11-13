import { build } from "./build";
import { getLatestVersion } from "./latest-version";
import { getRequiredBuilds } from "./required-build";

const latest = await getLatestVersion("insiders");
const platforms = await getRequiredBuilds(latest.version);
await build(latest, platforms);
