"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_nls_1 = require("vscode-nls");
const localize = vscode_nls_1.loadMessageBundle(__filename);
class MergeConflictCodeLensProvider {
    constructor(context, trackerService) {
        this.context = context;
        this.tracker = trackerService.createTracker('codelens');
    }
    begin(config) {
        this.config = config;
        if (this.config.enableCodeLens) {
            this.registerCodeLensProvider();
        }
    }
    configurationUpdated(updatedConfig) {
        if (updatedConfig.enableCodeLens === false && this.codeLensRegistrationHandle) {
            this.codeLensRegistrationHandle.dispose();
            this.codeLensRegistrationHandle = null;
        }
        else if (updatedConfig.enableCodeLens === true && !this.codeLensRegistrationHandle) {
            this.registerCodeLensProvider();
        }
        this.config = updatedConfig;
    }
    dispose() {
        if (this.codeLensRegistrationHandle) {
            this.codeLensRegistrationHandle.dispose();
            this.codeLensRegistrationHandle = null;
        }
    }
    provideCodeLenses(document, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config || !this.config.enableCodeLens) {
                return null;
            }
            let conflicts = yield this.tracker.getConflicts(document);
            if (!conflicts || conflicts.length === 0) {
                return null;
            }
            let items = [];
            conflicts.forEach(conflict => {
                let acceptCurrentCommand = {
                    command: 'merge-conflict.accept.current',
                    title: localize(0, null),
                    arguments: ['known-conflict', conflict]
                };
                let acceptIncomingCommand = {
                    command: 'merge-conflict.accept.incoming',
                    title: localize(1, null),
                    arguments: ['known-conflict', conflict]
                };
                let acceptBothCommand = {
                    command: 'merge-conflict.accept.both',
                    title: localize(2, null),
                    arguments: ['known-conflict', conflict]
                };
                let diffCommand = {
                    command: 'merge-conflict.compare',
                    title: localize(3, null),
                    arguments: [conflict]
                };
                items.push(new vscode.CodeLens(conflict.range, acceptCurrentCommand), new vscode.CodeLens(conflict.range.with(conflict.range.start.with({ character: conflict.range.start.character + 1 })), acceptIncomingCommand), new vscode.CodeLens(conflict.range.with(conflict.range.start.with({ character: conflict.range.start.character + 2 })), acceptBothCommand), new vscode.CodeLens(conflict.range.with(conflict.range.start.with({ character: conflict.range.start.character + 3 })), diffCommand));
            });
            return items;
        });
    }
    registerCodeLensProvider() {
        this.codeLensRegistrationHandle = vscode.languages.registerCodeLensProvider({ pattern: '**/*' }, this);
    }
}
exports.default = MergeConflictCodeLensProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/cb82febafda0c8c199b9201ad274e25d9a76874e/extensions/merge-conflict/out/codelensProvider.js.map
