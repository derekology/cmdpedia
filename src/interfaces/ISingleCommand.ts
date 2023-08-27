export interface ISingleCommandArgs {
    id: number,
    flag: string,
    placeholder: string,
    description: string,
};

export interface ISingleCommandOptions {
    id: number,
    flag: string,
    description: string,
};

export interface ISingleCommandParams {
    id: number,
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

export interface IInputToModify {
    list: 'arg' | 'option' | 'param',
    item: ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams
}