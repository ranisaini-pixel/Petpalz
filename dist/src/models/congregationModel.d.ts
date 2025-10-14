import mongoose, { Document, ObjectId } from "mongoose";
export interface ICongregation extends Document {
    congregationName: string;
    congregationState: ObjectId;
    congregationCity: ObjectId;
    zipCode: string;
}
declare const congregationModel: mongoose.Model<ICongregation, {}, {}, {}, mongoose.Document<unknown, {}, ICongregation, {}, {}> & ICongregation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default congregationModel;
//# sourceMappingURL=congregationModel.d.ts.map