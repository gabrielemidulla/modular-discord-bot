import { Events } from "discord.js";


export class Event<T> {
    public name: Events;
    public once: boolean;

    constructor(name: Events, once: boolean = false) {
        this.name = name;
        this.once = once;
    }

    async execute(parameter: T) { };
}