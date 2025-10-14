import mongoose, { Document, ObjectId } from "mongoose";
export interface ICity extends Document {
    name: string;
    state: ObjectId;
}
declare const cityModel: mongoose.Model<ICity, {}, {}, {}, mongoose.Document<unknown, {}, ICity, {}, {}> & ICity & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default cityModel;
//# sourceMappingURL=cityModel.d.ts.map