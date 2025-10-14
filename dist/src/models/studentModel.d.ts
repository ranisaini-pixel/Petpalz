import mongoose, { Document } from "mongoose";
export interface IStudent extends Document {
    rollNo: number;
    name: string;
    password: string;
    collegeName: string;
    token: string;
    course: string;
    country: mongoose.Schema.Types.ObjectId;
    state: mongoose.Schema.Types.ObjectId;
    city: mongoose.Schema.Types.ObjectId;
}
declare const studentModel: mongoose.Model<IStudent, {}, {}, {}, mongoose.Document<unknown, {}, IStudent, {}, {}> & IStudent & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default studentModel;
//# sourceMappingURL=studentModel.d.ts.map