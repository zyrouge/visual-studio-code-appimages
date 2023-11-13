import { BuildPlatformsType, isSupportedBuildPlatform } from "./platforms";

export interface LatestVersion {
    type: "stable" | "insiders";
    version: string;
    assets: Record<BuildPlatformsType, string>;
}

export const getLatestVersion = async (type: LatestVersion["type"]) => {
    const url = `https://code.visualstudio.com/sha?build=${type}`;
    const resp = await fetch(url);
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
