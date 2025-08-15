const TableMappingSchema = new mongoose.Schema({
  name: String,
  sourceTable: String,
  targetTable: String,
  sourceField: String,
  targetField: String,
}, { timestamps: true });

export default mongoose.model('TableMapping', TableMappingSchema);
