const DashboardSchema = new mongoose.Schema({
  name: String,
  charts: [String], // Chart IDs
}, { timestamps: true });

export default mongoose.model('Dashboard', DashboardSchema);
