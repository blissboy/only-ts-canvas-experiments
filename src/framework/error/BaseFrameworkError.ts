import {FrameworkError} from "../types";

export class BaseFrameworkError implements FrameworkError {

    readonly message: string;

    constructor(message: string) {
        this.message = message;
    }
}