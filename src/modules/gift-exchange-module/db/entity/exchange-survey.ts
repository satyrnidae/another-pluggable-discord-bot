import { DataEntity } from "api/db";
import { PrimaryGeneratedColumn, ManyToOne, Entity, Column } from "typeorm";
import { Exchange } from "./exchange";
import { ExchangeMember } from "./exchange-member";

export enum SurveyStep {
    SupplyAddress = 0,     // Do you wish to specify / update your delivery address? (Yes/No) (Show current address if present)
    AddressCollection = 1, // Please (specify|update) your address (skipped if not specified or not updated)
    DiscloseAddress = 2,   // Do you wish to disclose your address to your assignee? (Yes/No) (skipped if not specified)
    DeliveryMethod = 3,    // (Please specify a delivery method (In-Person / Mail)|Since you did not (provide | disclose) your address your assignee
                           // will have to deliver your gift **in-person**. Is this OK? You will be asked to specify an address if not. (Yes/No)
    RespecifyAddress = 4,  // Please specify your address (delivery preference set to MAIL, skipped if in-person is ok)
    SupplyGiftIdea = 5,    // Would you like to specify a gift idea for your assignee? (Yes/No)
    GiftIdea = 6,          // In 2000 characters or less please specify your gift preferences.
    Complete = 7           // Thank you! The survey is now complete.
}

@Entity('gex/ExchangeSurvey')
export class ExchangeSurvey extends DataEntity {
    save(): Promise<this & DataEntity> {
        throw new Error("Method not implemented.");
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Exchange)
    exchange: Exchange;

    @ManyToOne(() => ExchangeMember)
    exchangeMember: ExchangeMember;

    @Column()
    active: boolean;

    @Column({
        type: 'enum',
        enum: SurveyStep,
        default: SurveyStep.SupplyAddress
    })
    currentStep: SurveyStep;
}