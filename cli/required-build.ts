import { BuildPlatforms } from "./platforms";
import { xfetch } from "./utils";

export const getRequiredBuilds = async (tag: string) => {
    const repo = "zyrouge/visual-studio-code-appimages";
    const url = `https://api.github.com/repos/${repo}/releases/tags/${tag}`;
    const platforms = [...BuildPlatforms];

    const resp = await xfetch(url);
    if (resp.status === 404) {
        return platforms;
    }

    // TODO
    const json = await resp.json();
    return [];
};
