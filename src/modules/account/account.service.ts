import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { MappedException } from 'nestjs-mapped-exception';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { Account } from './account.entity';
import { AccountException } from './account.exception';
import { GetAllAccountType } from './types/GetAllAccount.type';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        private readonly exception: MappedException<AccountException>,
    ) {}

    async getAccounts(filters: GetAllAccountType): Promise<Account[]> {
        const conditions: FindManyOptions<Account> = {
            take: filters.take,
            skip: filters.skip,
        };

        if (filters.search) {
            conditions.where = { firstName: Like('%' + filters.search + '%') };
        }

        return await this.accountRepository.find({
            ...conditions,
            withDeleted: false,
        });
    }

    public async getById(id: string): Promise<Account> {
        const account = await this.accountRepository.findOne({
            where: { id },
            withDeleted: false,
        });
        if (!account) {
            this.exception.ERRORS.NOT_FOUND.throw();
        }

        return account;
    }

    async exists(email: string): Promise<boolean> {
        const account = await this.accountRepository.findOne({
            where: { email },
            withDeleted: false,
        });

        return !!account;
    }

    async createAndSave(createAccountInput: Account) {
        if (await this.exists(createAccountInput.email)) {
            this.exception.ERRORS.ALREADY_EXISTS.throw();
        }

        const account = this.accountRepository.create(createAccountInput);

        return await this.accountRepository.save(account);
    }

    async update(
        account: Account,
        accountUpdateData: Omit<Account, 'address' | 'network'>,
    ): Promise<Account> {
        const accountUpdate = this.accountRepository.merge(
            account,
            accountUpdateData,
        );

        return await this.accountRepository.save(accountUpdate);
    }

    async delete(account: Account): Promise<boolean> {
        account.deletedAt = format(new Date(), 'yyyy-MM-dd');
        await this.accountRepository.save(account);

        return true;
    }
}
