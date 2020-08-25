import { ResultBaseModel } from './ResultBaseModel';

export class ResponseModel<T> extends ResultBaseModel {
    items: T[];
}
