import { Field, ObjectType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AccountContact } from '../accountContact/accountContact.entity';
import { Adresses } from '../adresses/adresses.entity';
import { Network } from '../network/network.entity';
import { Attachment } from '../attachment/attachment.entity';
import { Scheduling } from '../scheduling/scheduling.entity';
import { AccountNetwork } from '../accountNetwork/accountNetwork.entity';
import { Handbook } from '../handbook/handbook.entity';

export enum GenreOptions {
    MASCULINO = 'masc',
    FEMININO = 'fem',
    OUTROS = 'others',
}

@Entity()
@ObjectType()
export class Account {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    @Field({ name: 'id', nullable: false })
    id: string;

    @Field()
    @Column({
        nullable: false,
    })
    firstName: string;

    @Field()
    @Column({
        nullable: false,
    })
    lastName: string;

    @Field()
    @Column({
        nullable: true,
    })
    email: string;

    @Field()
    @Column({
        type: 'enum',
        enum: GenreOptions,
        nullable: false,
        default: GenreOptions.OUTROS,
    })
    genre: GenreOptions;

    @Field()
    @Column({
        nullable: true,
    })
    dateOfBirth: string;

    @Field()
    @Column({
        nullable: false,
    })
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async comparePassword(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password);
    }

    @Field(() => [AccountNetwork], { defaultValue: [] })
    @OneToMany(
        () => AccountNetwork,
        accountNetwork => accountNetwork.account,
        {
            nullable: true,
            cascade: ['insert', 'update', 'remove'],
            eager: true,
        },
    )
    accountNetwork: AccountNetwork[];

    @Field(() => [Adresses], { defaultValue: [] })
    @OneToMany(
        () => Adresses,
        adresses => adresses.account,
        {
            nullable: true,
            cascade: ['insert', 'update', 'remove'],
            eager: true,
        },
    )
    adresses: Adresses[];

    @Field(() => [Handbook], { defaultValue: [] })
    @OneToMany(
        () => Handbook,
        handbook => handbook.account,
        {
            nullable: true,
            cascade: ['insert', 'update', 'remove'],
            eager: true,
        },
    )
    handbook: Handbook[];

    @Field(() => [Scheduling], { defaultValue: [] })
    @OneToMany(
        () => Scheduling,
        scheduling => scheduling.patient,
        {
            nullable: true,
            cascade: ['insert', 'update', 'remove'],
            eager: true,
        },
    )
    patient: Scheduling[];

    @Field(() => [Scheduling], { defaultValue: [] })
    @OneToMany(
        () => Scheduling,
        scheduling => scheduling.professional,
        {
            nullable: true,
            cascade: ['insert', 'update', 'remove'],
            eager: true,
        },
    )
    professional: Scheduling[];

    @Field(() => [Scheduling], { defaultValue: [] })
    @OneToMany(
        () => Scheduling,
        scheduling => scheduling.clerk,
        {
            nullable: true,
            cascade: ['insert', 'update', 'remove'],
            eager: true,
        },
    )
    clerk: Scheduling[];

    @Field(() => [Attachment], { defaultValue: [] })
    @OneToMany(
        () => Attachment,
        attachment => attachment.account,
        {
            nullable: true,
            cascade: ['insert', 'update', 'remove'],
            eager: true,
        },
    )
    attachment: Attachment[];

    @Field(() => [AccountContact], { defaultValue: [] })
    @OneToMany(
        () => AccountContact,
        accountContact => accountContact.account,
        {
            nullable: true,
            cascade: ['insert', 'update', 'remove'],
            eager: true,
        },
    )
    accountContact: AccountContact[];

    @Field(() => Network, { nullable: false })
    @Column({ name: 'networkId', type: 'uuid' })
    @ManyToOne(
        () => Network,
        network => network.id,
        {
            onDelete: 'CASCADE',
            nullable: false,
        },
    )
    network: Network;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'LOCALTIMESTAMP',
    })
    @Field()
    createdAt: string;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'LOCALTIMESTAMP',
    })
    @Field()
    updatedAt: string;

    @DeleteDateColumn({
        type: 'timestamp',
        default: null,
        nullable: true,
    })
    @Field()
    deletedAt: string;
}
