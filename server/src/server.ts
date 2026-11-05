import 'reflect-metadata';
import express from "express"
import { errorHandler } from "./presentation/middlewares/errorHandler";

import cors from "cors";
import http from "http";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { env } from "./config/env";
import { connectMongoDB } from "./infrastructure/database/mongoConnection";
import logger from "./config/logger";

import authRoutes from './presentation/routes/auth/auth.routes'
import organizationRoutes from './presentation/routes/organization/organization.routes'
import userRoutes from './presentation/routes/user/user.routes'
import invitationRoutes from './presentation/routes/invitation/invitation.routes'
import teamRoutes from './presentation/routes/team/team.routes'
import projectRoutes from './presentation/routes/project/project.routes'
import epicRoutes from './presentation/routes/epic/epic.routes'
import storyRoutes from './presentation/routes/story/story.routes'
import notificationRoutes from './presentation/routes/notification/notification.routes'
import meetingRoutes from './presentation/routes/meeting/meeting.routes';

import { initializeSocketServer } from './infrastructure/socket/socketServer';



const app = express()
app.use(cookieParser())

if (process.env.NODE_ENV === "development") {
  app.use(morgan('dev'));
}

const allowedOrigins = env.CLIENT_URL.split(",").map((o) => o.trim());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json())
//////



app.use(env.AUTH_API_PREFIX, authRoutes)
app.use(env.ORGANIZATION_API_PREFIX, organizationRoutes)
app.use(env.USER_API_PREFIX, userRoutes)
app.use(env.INVITATION_API_PREFIX,invitationRoutes)
app.use(env.TEAM_API_PREFIX,teamRoutes)
app.use(env.PROJECT_API_PREFIX,projectRoutes)
app.use(env.EPIC_API_PREFIX,epicRoutes)
console.log("Epic routes mounted at:", env.EPIC_API_PREFIX);
app.use(env.STORY_API_PREFIX,storyRoutes)
app.use(env.NOTIFICATION_API_PREFIX,notificationRoutes)
app.use(env.STORY_API_PREFIX, meetingRoutes);


app.use(errorHandler);

const startServer = async () => {
  await connectMongoDB();
  const server = http.createServer(app);
  const io = initializeSocketServer(server);
  server.listen(env.PORT, () => {
    logger.info(`server running on port ${env.APP_URL}`)
  })
}
startServer();




