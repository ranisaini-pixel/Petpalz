import mongoose, { Document, ObjectId } from "mongoose";
export interface IUserAvailability extends Document {
    userId: ObjectId;
    expiry: Date;
}
declare const userAvailabilityModel: mongoose.Model<IUserAvailability, {}, {}, {}, mongoose.Document<unknown, {}, IUserAvailability, {}, {}> & IUserAvailability & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default userAvailabilityModel;
//# sourceMappingURL=userAvailabilityModel.d.ts.map