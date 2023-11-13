export const BuildPlatforms = [
    "linux-x64",
    "linux-armhf",
    "linux-arm64",
] as const;

export type BuildPlatformsType = (typeof BuildPlatforms)[number];

export const isSupportedBuildPlatform = (
    value: string
): value is BuildPlatformsType => {
    return BuildPlatforms.includes(value as BuildPlatformsType);
};
