import { BuildPlatforms } from "./platforms";
import { xfetch } from "./utils";

export const getRequiredBuilds = async (version: string) => {
    const repo = "zyrouge/visual-studio-code-appimages";
    const url = `https://api.github.com/repos/${repo}/releases/tags/v${version}`;
    const platforms = [...BuildPlatforms];

    const resp = await xfetch(url);
    if (resp.status === 404) {
        return platforms;
    }

    const json: {
        name: string;
        assets: {
            name: string;
        }[];
    } = (await resp.json()) as any;
    const ignored = json.assets
        .map((x) => {
            const arch = x.name.match(/-([^-]+)\.AppImage/)?.[1];
            return arch ? `linux-${arch}` : undefined;
        })
        .filter((x) => typeof x === "string");
    return platforms.filter((x) => !ignored.includes(x));
};
