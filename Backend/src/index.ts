import express from "express";
import cors from 'cors';
import authRoutes from "./routes/auth.route";
import otpRoutes from "./routes/otp.route";
import canteenRoutes from "./routes/canteen.route"; 
import notesRoutes from "./routes/notes.route";
import guidanceRoutes from "./routes/guidance.route";
import seniorRequestRoutes from "./routes/seniorRequest.route";

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/otp', otpRoutes);
app.use('/api/v1/canteen', canteenRoutes );
app.use('/api/v1/notes', notesRoutes);
app.use('/api/v1/guidance', guidanceRoutes);
app.use('/api/v1/senior-request', seniorRequestRoutes);

app.listen(5000, "0.0.0.0", () => {
  console.log("Server started");
});

app.get("/health", (req, res) => {
  res.send("Welcome to the CUAssist API");
});