import express from 'express';
import * as securityMiddleware from './middleware/security';
import tenantRoutes from './routes/tenantRoutes';
import authRoutes from './routes/authRoutes';
import ultravoxRoutes from './routes/ultravoxRoutes';
import metricsRoutes from './routes/metricsRoutes';
import brandingRoutes from './routes/brandingRoutes';
import { connectDB } from './utils/db';
import cors from "cors";

export const app = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

// Middleware setup
app.use(express.json());
app.use(securityMiddleware.validateApiKey);
app.use(securityMiddleware.enforceTenantIsolation);

app.use(cors({
  origin: "https://devho-frontend.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Subdomain extraction middleware
app.use((req, _res, next) => {
    const host = req.headers.host || '';
    const subdomain = host.split('.')[0];
    (req as any).subdomain = subdomain;
    next();
});

// Auth routes
app.use('/auth', authRoutes);
// Ultravox routes
app.use('/ultravox', ultravoxRoutes);
// Metrics routes
app.use('/metrics', metricsRoutes);
// Branding routes
app.use('/branding', brandingRoutes);
// Tenant routes (MongoDB-backed)
app.use('/tenants', tenantRoutes);

// Start the server only if not in test environment

// Connect to MongoDB and start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    connectDB().then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    });
}

export default app;