import type { ISingleCommandArgs, ISingleCommandOptions } from '@/interfaces/ISingleCommand';

export const PSCOMMONARGS: ISingleCommandArgs[] = [
    {
        id: 9999,
        flag: '-ErrorAction',
        placeholder: 'error action',
        separator: ':',
        description: 'Determines how the cmdlet responds to a non-terminating error from the command. This parameter works only when the command generates a non-terminating error, such as those from the Write-Error cmdlet. Value can be Break, Suspend, Ignore, Inquire, Continue, Stop, or SilentlyContinue.',
        required: false
    },
    {
        id: 9998,
        flag: '-ErrorVariable',
        placeholder: 'error variable',
        separator: ' ',
        description: 'Stores error messages about the command in the specified variable and in the $Error automatic variable.',
        required: false
    },
    {
        id: 9997,
        flag: '-InformationAction',
        placeholder: 'information action',
        separator: ':',
        description: 'Overrides the value of the $InformationPreference preference variable, which by default is set to SilentlyContinue. When you use Write-Information in a script with InformationAction, Write-Information values are shown depending on the value of the InformationAction parameter. Value can be Break, Suspend, Ignore, Inquire, Continue, Stop, or SilentlyContinue.',
        required: false
    },
    {
        id: 9996,
        flag: '-InformationVariable',
        placeholder: 'information variable',
        separator: ':',
        description: 'Stores in a variable a string that you specify by adding the Write-Information command. Write-Information values are shown depending on the value of the InformationAction common parameter; if you don\'t add the InformationAction common parameter, Write-Information strings are shown depending on the value of the $InformationPreference preference variable.',
        required: false
    },
    {
        id: 9995,
        flag: '-OutBuffer',
        placeholder: 'number',
        separator: ' ',
        description: 'Determines the number of objects to accumulate in a buffer before any objects are sent through the pipeline. If you omit this parameter, objects are sent as they\'re generated.',
        required: false
    },
    {
        id: 9994,
        flag: '-OutVariable',
        placeholder: 'variable',
        separator: ' ',
        description: 'Stores output objects from the command in the specified variable in addition to sending the output along the pipeline.',
        required: false
    },
    {
        id: 9993,
        flag: '-PipelineVariable',
        placeholder: 'variable',
        separator: ' ',
        description: 'Allows access to the most recent value passed into the next pipeline segment by the command that uses this parameter. Any command in the pipeline can access the value using the named PipelineVariable. The value is assigned to the variable when it\'s passed into the next pipeline segment. This makes the PipelineVariable easier to use than a specific temporary variable, which might need to be assigned in multiple locations.',
        required: false
    },
    {
        id: 9992,
        flag: '-WarningAction',
        placeholder: 'warning action',
        separator: ':',
        description: 'Determines how the cmdlet responds to a warning from the command. Continue is the default value. This parameter works only when the command generates a warning message. Value can be Break, Suspend, Ignore, Inquire, Continue, Stop, or SilentlyContinue.',
        required: false
    },
    {
        id: 9991,
        flag: '-WarningVariable',
        placeholder: 'variable',
        separator: ':',
        description: 'Stores warnings about the command in the specified variable.',
        required: false
    }
];

export const PSCOMMONOPTIONS: ISingleCommandOptions[] = [
    {
        id: 9999,
        flag: '-Debug',
        description: 'Displays programmer-level detail about the operation done by the command. This parameter works only when the command generates a debugging message.',
        required: false
    },
    {
        id: 9998,
        flag: '-Verbose',
        description: 'Displays detailed information about the operation done by the command. This information resembles the information in a trace or in a transaction log. This parameter works only when the command generates a verbose message.',
        required: false
    },
    {
        id: 9997,
        flag: '-WhatIf',
        description: 'Displays a message that describes the effect of the command, instead of executing the command.',
        required: false
    },
    {
        id: 9996,
        flag: '-Confirm',
        description: 'Prompts you for confirmation before executing the command.',
        required: false
    }
];