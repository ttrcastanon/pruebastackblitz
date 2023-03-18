
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class CleanQueryHelper {

    constructor() { }

    public static cleanQuery(query: string): string {
        if (query.includes('this.brf.EvaluaQueryDictionary')) {
            query = query.replace("this.brf.EvaluaQueryDictionary('", "");
            query = query.replace("', 1, 'ABC123')", "");
        }
        else if (query.includes('this.brf.EvaluaQuery')) {
            query = query.replace("this.brf.EvaluaQuery('", "");
            query = query.replace("', 1, 'ABC123')", "");
        }

        return query;
    }
}