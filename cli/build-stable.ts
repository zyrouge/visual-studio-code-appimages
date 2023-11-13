import { build } from "./build";
import { getLatestVersion } from "./latest-version";
import { getRequiredBuilds } from "./required-build";

const latest = await getLatestVersion("stable");
const platforms = await getRequiredBuilds(latest.version);
await build(latest, platforms);
