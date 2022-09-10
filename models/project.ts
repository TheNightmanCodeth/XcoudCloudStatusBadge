import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";

export interface ProjectSchema {
    _id: ObjectId;
    buildStatus: boolean;
    testsFailing: number;
    testsPassing: number;
    belongsTo: ObjectId;
}