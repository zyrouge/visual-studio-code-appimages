import p from "path";
import { existsSync } from "fs";
import { chmod, copyFile, mkdir, rename, rm } from "fs/promises";
import { BuildPlatformsType } from "./platforms";
import { LatestVersion } from "./latest-version";
import { xfetch } from "./utils";

const rootDir = p.resolve(import.meta.dir, "..");
const artifactsDir = p.join(rootDir, "artifacts");
const templatesDir = p.join(rootDir, "templates");
const outputDir = p.join(rootDir, "dist");

export const build = async (
    version: LatestVersion,
    platforms: BuildPlatformsType[]
) => {
    await ensureDir(artifactsDir);
    await ensureDir(outputDir);
    const appImageTool = await downloadAppImageTool();
    for (const platform of platforms) {
        const arch = platform.split("-").at(-1)!;
        const url = version.assets[platform];
        const inputFile = p.join(
            artifactsDir,
            `visual-studio-code-${version.type}-${arch}.tar.gz`
        );
        const outputFile = p.join(
            outputDir,
            `visual-studio-code-${version.type}-${arch}.AppImage`
        );
        await downloadFile(url, inputFile);
        const appDir = await buildAppDir(version.type, platform, inputFile);
        await packAppDir(platform, appImageTool, appDir, outputFile);
    }
    await Bun.write(p.join(outputDir, "build-version.txt"), version.version);
    if (platforms.length > 0) {
        await Bun.write(p.join(outputDir, "build-complete.txt"), "");
    }
};

const packAppDir = async (
    platform: BuildPlatformsType,
    appImageTool: string,
    appDir: string,
    outputFile: string
) => {
    const arch = getArchFromPlatform(platform);
    console.log(`Packing "${appDir}" into "${outputFile}"`);
    const proc = Bun.spawn([appImageTool, appDir, outputFile], {
        env: {
            ...process.env,
            ARCH: arch,
        },
        stdin: "inherit",
        stdout: "inherit",
    });
    if ((await proc.exited) !== 0) {
        throw new Error(`Packing "${appDir}" failed`);
    }
    console.log(`Packed "${appDir}" into "${outputFile}"`);
};

const buildAppDir = async (
    type: LatestVersion["type"],
    platform: BuildPlatformsType,
    inputFile: string
) => {
    const appDir = p.join(
        artifactsDir,
        `${p.basename(inputFile, ".tar.gz")}.AppDir`
    );
    await rm(appDir, {
        recursive: true,
    });
    await ensureDir(appDir);
    console.log(`Extracting "${inputFile}"`);
    const appDirProc = Bun.spawn(["tar", "-xvf", inputFile], {
        cwd: artifactsDir,
        stdout: "inherit",
        stderr: "inherit",
    });
    if ((await appDirProc.exited) !== 0) {
        throw new Error(`Extracting "${inputFile}" failed`);
    }
    await rename(p.join(artifactsDir, `VSCode-${platform}`), appDir);
    console.log(`Extracted "${inputFile}"`);
    await createDesktopFile(type, appDir);
    await createAppRunFile(type, appDir);
    await createIconFile(type, appDir);
    return appDir;
};

const createIconFile = async (type: LatestVersion["type"], appDir: string) => {
    const name = getNameFromType(type);
    const from = p.join(appDir, "resources/app/resources/linux/code.png");
    const to = p.join(appDir, `${name}.png`);
    await copyFile(from, to);
    console.log(`Created "${to}"`);
};

const createDesktopFile = async (
    type: LatestVersion["type"],
    appDir: string
) => {
    const name = getNameFromType(type);
    const title = getTitleFromType(type);
    const templateFile = p.join(templatesDir, "visual-studio-code.desktop");
    const template = await Bun.file(templateFile).text();
    const content = template
        .replaceAll("@@NAME@@", name)
        .replaceAll("@@TITLE@@", title);
    const desktopFile = p.join(appDir, `${name}.desktop`);
    await Bun.write(desktopFile, content);
    console.log(`Created "${desktopFile}"`);
};

const createAppRunFile = async (
    type: LatestVersion["type"],
    appDir: string
) => {
    const name = getNameFromType(type);
    const templateFile = p.join(templatesDir, "AppRun");
    const template = await Bun.file(templateFile).text();
    const content = template.replaceAll("@@NAME@@", name);
    const appRunFile = p.join(appDir, "AppRun");
    await Bun.write(appRunFile, content);
    await chmod(appRunFile, 0o755);
    console.log(`Created "${appRunFile}"`);
};

const platformArchMap: Record<BuildPlatformsType, string> = {
    "linux-x64": "x86_64",
    "linux-armhf": "armhf",
    "linux-arm64": "aarch64",
};

const getArchFromPlatform = (platform: BuildPlatformsType) => {
    return platformArchMap[platform];
};

const typeNameMap: Record<LatestVersion["type"], string> = {
    stable: "code",
    insiders: "code-insiders",
};

const typeTitleMap: Record<LatestVersion["type"], string> = {
    stable: "Code",
    insiders: "Code Insiders",
};

const getNameFromType = (type: LatestVersion["type"]) => {
    return typeNameMap[type];
};

const getTitleFromType = (type: LatestVersion["type"]) => {
    return typeTitleMap[type];
};

const downloadAppImageTool = async () => {
    const url =
        "https://github.com/AppImage/appimagetool/releases/download/continuous/appimagetool-x86_64.AppImage";
    const appImageFile = p.join(artifactsDir, "appimagetool.AppImage");
    const appDir = p.join(artifactsDir, "appimagetool.AppDir");
    const appRunFile = p.join(appDir, "AppRun");
    if (existsSync(appDir)) {
        console.log(
            `Skipped downloading "${appImageFile}" as "${appRunFile}" exists`
        );
        return appRunFile;
    }
    await downloadFile(url, appImageFile);
    console.log(`Extracting "${appImageFile}"`);
    await chmod(appImageFile, 0o755);
    const proc = Bun.spawn([appImageFile, "--appimage-extract"], {
        cwd: artifactsDir,
        stdout: "inherit",
        stderr: "inherit",
    });
    if ((await proc.exited) !== 0) {
        throw new Error(`Extracting "${appImageFile}" failed`);
    }
    console.log(`Extracted "${appImageFile}"`);
    await rename(p.join(artifactsDir, "squashfs-root"), appDir);
    await chmod(appRunFile, 0o755);
    return appRunFile;
};

const downloadFile = async (url: string, file: string) => {
    console.log(`Downloading "${url}" into "${file}"`);
    if (existsSync(file)) {
        console.log(`Skipped downloading "${url}" into "${file}"`);
        return file;
    }
    const resp = await xfetch(url);
    await Bun.write(file, resp);
    console.log(`Downloaded "${url}" into "${file}"`);
    return file;
};

const ensureDir = async (dir: string) => {
    console.log(`Creating "${dir}"`);
    await mkdir(dir, {
        recursive: true,
    });
    console.log(`Created "${dir}"`);
};
