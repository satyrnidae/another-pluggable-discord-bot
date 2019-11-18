import { Entity, PrimaryGeneratedColumn, Column, Repository } from 'typeorm';
import { DBConnection, AppConfiguration, Container, SERVICE_IDENTIFIERS, DBObject } from 'api';
import { Guild } from 'discord.js';

@Entity()
export default class GuildConfiguration extends DBObject {

    static async load(guild: Guild): Promise<GuildConfiguration> {
        const dbConnection: DBConnection = Container.get(SERVICE_IDENTIFIERS.DB_CONNECTION);
        const configuration: AppConfiguration = Container.get(SERVICE_IDENTIFIERS.CONFIGURATION);

        const guildRepository: Repository<GuildConfiguration> = dbConnection.instance.getRepository(GuildConfiguration);
        let guildConfiguration: GuildConfiguration = await guildRepository.findOne({nativeId: guild.id});

        if(!guildConfiguration) {
            guildConfiguration = new GuildConfiguration();
            guildConfiguration.commandPrefix = configuration.defaultPrefix;
            guildConfiguration.welcomeMsgSent = false;
            guildConfiguration.nativeId = guild.id;
        }

        return Promise.resolve(guildConfiguration);
    }

    async save(): Promise<this & GuildConfiguration> {
        const dbConnection: DBConnection = Container.get(SERVICE_IDENTIFIERS.DB_CONNECTION);
        const guildRepository: Repository<GuildConfiguration> = dbConnection.instance.getRepository(GuildConfiguration);

        return await guildRepository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nativeId: string;

    @Column()
    commandPrefix: string;

    @Column()
    welcomeMsgSent: boolean;
}
