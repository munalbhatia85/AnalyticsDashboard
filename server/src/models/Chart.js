const ChartSchema = new mongoose.Schema({
  title: String,
  type: String,
  dataSource: String, // Ref to joined data or json collection
  config: Object,
}, { timestamps: true });

export default mongoose.model('Chart', ChartSchema);
