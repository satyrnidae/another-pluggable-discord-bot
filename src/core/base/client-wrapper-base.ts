import { ClientWrapper } from "api";
import { Client } from "discord.js";
import { injectable } from "inversify";

@injectable()
export default class ClientWrapperBase implements ClientWrapper {
    client: Client;
}