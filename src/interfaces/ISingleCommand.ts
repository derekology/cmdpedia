export interface ISingleCommandArgs {
    id: number,
    flag: string,
    placeholder: string,
    value?: string,
    description: string,
    required: boolean
};

export interface ISingleCommandOptions {
    id: number,
    flag: string,
    value?: string,
    description: string,
    required: boolean
};

export interface ISingleCommandParams {
    id: number,
    placeholder: string,
    value?: string,
    description: string,
    required: boolean
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

export interface IInputToModify {
    list: 'arg' | 'option' | 'param',
    item: ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams
};