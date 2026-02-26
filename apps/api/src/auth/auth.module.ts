import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PrismaService } from "../database/prisma.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "8h" },
      }),
    }),
  ],
  providers: [AuthService, PrismaService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
