import mongoose, { Document, ObjectId } from "mongoose";
export interface IState extends Document {
    name: string;
    countryId: ObjectId;
}
declare const stateModel: mongoose.Model<IState, {}, {}, {}, mongoose.Document<unknown, {}, IState, {}, {}> & IState & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default stateModel;
//# sourceMappingURL=stateModel.d.ts.map