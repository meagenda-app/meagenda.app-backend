import { InputType } from '@nestjs/graphql';
import { HandbookInput } from './handbook.input';

@InputType()
export class CreateHandbookInput extends HandbookInput {}
