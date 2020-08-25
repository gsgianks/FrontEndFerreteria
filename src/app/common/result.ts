import { ResultBaseModel } from './ResultBaseModel';

export class Result<T, J> extends ResultBaseModel {
    item: T;
    itemOptional: J;
}
