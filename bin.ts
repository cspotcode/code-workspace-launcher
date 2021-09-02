#!/usr/bin/env ts-node
import { homedir } from "os";
import { join, basename, resolve } from "path";
import {$, glob} from 'zx';
import {prompt} from 'inquirer';
import {existsSync, readdirSync, writeFileSync} from 'fs';

async function main() {
    const devDir = join(homedir(), 'dev');
    const allProjects = await glob('*', {
        cwd: devDir,
        onlyDirectories: true
    });
    const {workspace} = await prompt([{
        type: 'list',
        pageSize: process.stdout.getWindowSize()[1] - 2,
        choices: allProjects.map(p => ({
            name: p,
            value: p,
        })),
        name: 'workspace'
    }]);
    const workspaceDir = join(devDir, workspace);
    const {workspaceFilePath, workspaceName} = getWorkspaceFilePath(workspaceDir);
    if(!existsSync(workspaceFilePath)) createWorkspace(workspaceDir);
    await $`code ${workspaceFilePath}`;
}

function getWorkspaceFilePath(workspacePath: string) {
    const workspaceName = basename(workspacePath);
    const workspaceFilePath = join(workspacePath, `${workspaceName}.code-workspace`);
    return {workspaceName, workspaceFilePath};
}
function createWorkspace(workspacePath: string) {
    const {workspaceFilePath, workspaceName} = getWorkspaceFilePath(workspacePath);
    writeFileSync(workspaceFilePath, JSON.stringify({
        folders: readdirSync(workspacePath, {withFileTypes: true})
        .filter(d => d.isDirectory())
        .map(d => ({
            name: d.name, path: d.name
        }))
    }, null, 2));
}

main();
