import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../database/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { memberships: { include: { organization: true } } },
    });

    if (!user?.passwordHash) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(pass, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const primaryMembership = user.memberships[0];
    const orgId = primaryMembership?.orgId;
    const role = primaryMembership?.role;

    const payload = {
      sub: user.id,
      email: user.email,
      orgId,
      role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: "8h",
      }),
    };
  }

  async signUp(email: string, name: string, pass: string) {
    const passwordHash = await bcrypt.hash(pass, 12);

    return this.prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        memberships: {
          create: {
            organization: {
              create: {
                name: `${name}'s Org`,
                slug: name.toLowerCase().replace(/\s/g, "-") + "-" + Date.now(),
              },
            },
          },
        },
      },
    });
  }
}
