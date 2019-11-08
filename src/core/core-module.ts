import { Module } from 'api';
import { Client } from 'discord.js';

export default class CoreModule extends Module {
    preInitialize() {
        throw new Error('Method not implemented.');
    }

    initialize() {
        throw new Error('Method not implemented.');
    }


    postInitialize(client: Client) {
        throw new Error('Method not implemented.');
    }
}