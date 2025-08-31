import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    done: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema, 'tasks');
