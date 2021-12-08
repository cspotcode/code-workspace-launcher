#!/usr/bin/env ts-node

import {resolve} from 'path';
import { createWorkspace, getWorkspaceFilePath } from './bin';

function main() {
    const dir = process.cwd();
    const workspacePath = resolve(dir);

    const {workspaceFilePath} = getWorkspaceFilePath(workspacePath);
    createWorkspace(workspaceFilePath);
}

if(require.main === module) {
    main();
}
