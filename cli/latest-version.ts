import { BuildPlatformsType, isSupportedBuildPlatform } from "./platforms";
import { xfetch } from "./utils";

export interface LatestVersion {
    type: "stable" | "insiders";
    version: string;
    assets: Record<BuildPlatformsType, string>;
}

export const getLatestVersion = async (type: LatestVersion["type"]) => {
    const buildCode = getBuildCodeFromType(type);
    const url = `https://code.visualstudio.com/sha?build=${buildCode}`;
    const resp = await xfetch(url);
    const json: {
        products: {
            url: string;
            productVersion: string;
            platform: {
                os: string;
            };
        }[];
    } = await resp.json();

    const version = json.products.find((x) => x.productVersion)!.productVersion;
    // @ts-expect-error
    const assets: LatestVersion["assets"] = {};
    json.products.forEach((x) => {
        const os = x.platform.os;
        if (isSupportedBuildPlatform(os)) {
            assets[os] = x.url;
        }
    });

    const output: LatestVersion = {
        type,
        version,
        assets,
    };
    return output;
};

const typeBuildCodeMap: Record<LatestVersion["type"], string> = {
    stable: "stable",
    insiders: "insider",
};

const getBuildCodeFromType = (type: LatestVersion["type"]) => {
    return typeBuildCodeMap[type];
};
