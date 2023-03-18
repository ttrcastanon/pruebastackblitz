import { Observable } from 'rxjs';
import { CrudResponseModel } from '../models/crud-response-model';


export interface DataProviderInterface<T> {

    getAll(): Observable<T[]>;

    getAllComplete(): Observable<T[]>;

    listaSelAll(pageIndex: number, pageSize: number): Observable<T>;

    getById(id: number): Observable<T>;

    insert(entity: T): Observable<number>;

    update(id: number, entity: T): Observable<number>;

    delete(id: number): Observable<null>;
}
