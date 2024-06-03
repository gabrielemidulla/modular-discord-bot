import { Color } from "./Color";

export enum LogType {
    Log,
    Error,
    Warn,
    Success
}
function _log(type: LogType, message: string, ...optionalParams: any[]) {
    const method = type === LogType.Error ? console.error : type === LogType.Warn ? console.warn : console.log;
    const emoji = type === LogType.Error ? '❌' : type === LogType.Warn ? '⚠️' : type === LogType.Success ? '✅' : '💬';
    method.apply(console, [`${type === LogType.Error ? Color.FgRed : type === LogType.Warn ? Color.FgYellow : type === LogType.Success ? Color.FgGreen : ''}[${new Date().toLocaleString()}]${Color.Reset}`, `${emoji} ${message}`, ...optionalParams]);
}
export class Logger {
    public static log(message: string, ...optionalParams: any[]) {
        _log(LogType.Log, message, ...optionalParams);
    }

    public static error(message: string, ...optionalParams: any[]) {
        _log(LogType.Error, message, ...optionalParams);
    }

    public static warn(message: string, ...optionalParams: any[]) {
        _log(LogType.Warn, message, ...optionalParams);
    }

    public static success(message: string, ...optionalParams: any[]) {
        _log(LogType.Success, message, ...optionalParams);
    }
}