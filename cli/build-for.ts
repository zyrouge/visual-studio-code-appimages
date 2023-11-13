import { build } from "./build";
import { LatestVersion, getLatestVersion } from "./latest-version";
import { getRequiredBuilds } from "./required-build";

export const buildFor = async (type: LatestVersion["type"]) => {
    const latest = await getLatestVersion(type);
    const platforms = await getRequiredBuilds(latest.version);
    await build(latest, platforms);
};
