export interface ISingleCommandArgs {
    flag: string,
    placeholder: string,
    description: string,
};

export interface ISingleCommandOptions {
    flag: string,
    description: string,
};

export interface ISingleCommandParams {
    placeholder: string,
    description: string,
};

export interface ISingleCommandTypes {
    id: number,
    name: string
};

export interface ISingleCommand {
    id: number,
    type: string,
    name: string,
    description: string,
    commandTypes: ISingleCommandTypes,
    commandArgs: ISingleCommandArgs[],
    commandParams: ISingleCommandParams[],
    commandOptions: ISingleCommandOptions[],
};