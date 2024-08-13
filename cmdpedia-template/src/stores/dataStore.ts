import { ref } from 'vue';
import { defineStore } from 'pinia';

import type { Ref } from 'vue';
import type { ISingleCommand, ISingleCommandSummary } from '@/interfaces/ISingleCommand';

export const useDataStore = defineStore(
    'dataStore', () => {
        const programName: Ref<string> = ref('');
        const programDocstring: Ref<string> = ref('');
        const entryFuncs: Ref<string[]> = ref([]);
        const allCommands: Ref<ISingleCommand[]> = ref([]);
        const allCommandTypes: Ref<string[]> = ref([]);
        const allCommandSummaries: Ref<ISingleCommandSummary[]> = ref([]);

        const programInfoJson: string = `MERGE_PROGRAM_INFO_JSON_HERE`;

        function parseProgramInfo(data: string): void {
            /**
             * Parse the allCommands list from the base64 encoded data
             * 
             * @param {string} data - Base64 encoded JSON string of all commands
            */
            const decodedData = atob(data);
            const programInfo = JSON.parse(decodedData);
            programDocstring.value = programInfo.docstring;
            programName.value = programInfo.runCommand;
            entryFuncs.value = programInfo.entryFuncs;
            allCommands.value = programInfo.commands;
        };

        function getAllCommandSummaries(): void {
            /**
             * Get all commands summaries from the allCommands list
             */
            const data: ISingleCommandSummary[] = allCommands.value.map((command: ISingleCommand): ISingleCommandSummary => {
                return {
                    id: command.id,
                    name: command.name,
                    description: command.description,
                    type: command.type,
                };
            });
            allCommandSummaries.value = data ? data : [];
        };

        function getAllCommandTypes(): void {
            /**
             * Get all command types from the allCommands list
             */
            const commandTypes: string[] = ['all'];
            allCommands.value.map((command: ISingleCommand): void => {
                commandTypes.push(command.type);
            });
            allCommandTypes.value = Array.from(new Set(commandTypes));
        };

        function getCommandById(commandId: number): ISingleCommand | null {
            /**
             * Get command by id from the allCommands list
             * 
             * @param {number}
             * @returns {ISingleCommand | undefined}
            */
            return allCommands.value.find((command: ISingleCommand): boolean => command.id === commandId) || null;
        };

        parseProgramInfo(programInfoJson);
        getAllCommandTypes();
        getAllCommandSummaries();

        return { programName, programDocstring, entryFuncs, allCommands, allCommandTypes, allCommandSummaries, getCommandById };
    })