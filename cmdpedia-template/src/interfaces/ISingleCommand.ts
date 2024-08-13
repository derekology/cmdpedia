export interface ISingleCommandOptions {
    id: number,
    flag: string,
    placeholder: string,
    separator: string | null,
    value?: string,
    description: string,
    required: boolean
};

export interface ISingleCommandFlags {
    id: number,
    flag: string,
    value?: string,
    description: string,
    required: boolean
};

export interface ISingleCommandArgs {
    id: number,
    placeholder: string,
    value?: string,
    description: string,
    required: boolean
};

export interface ISingleCommandSummary {
    id: number,
    name: string,
    description: string,
    type: string
};

export interface ISingleCommand {
    id: number,
    type: string,
    name: string,
    group: string,
    description: string,
    CommandOptions: ISingleCommandOptions[],
    CommandArgs: ISingleCommandArgs[],
    CommandFlags: ISingleCommandFlags[]
};

export interface IInputToModify {
    list: 'option' | 'flag' | 'arg',
    item: ISingleCommandOptions | ISingleCommandFlags | ISingleCommandArgs
};

export interface ICommandToSave {
    id: number,
    name: string,
    saveTime?: Date,
    description: string,
    command: string
}