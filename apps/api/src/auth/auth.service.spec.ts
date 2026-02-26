import { UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  } as any;

  const jwtService = {
    signAsync: jest.fn(),
  } as any;

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(prisma, jwtService);
  });

  it("should return token for valid credentials", async () => {
    const hash = await bcrypt.hash("correct-password", 12);
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      passwordHash: hash,
      memberships: [{ orgId: "org-1", role: "OWNER" }],
    });
    jwtService.signAsync.mockResolvedValue("signed-token");

    const result = await service.signIn("user@example.com", "correct-password");

    expect(result).toEqual({ access_token: "signed-token" });
    expect(jwtService.signAsync).toHaveBeenCalledWith(
      {
        sub: "user-1",
        email: "user@example.com",
        orgId: "org-1",
        role: "OWNER",
      },
      { expiresIn: "8h" },
    );
  });

  it("should throw UnauthorizedException for invalid password", async () => {
    const hash = await bcrypt.hash("correct-password", 12);
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      passwordHash: hash,
      memberships: [{ orgId: "org-1", role: "OWNER" }],
    });

    await expect(
      service.signIn("user@example.com", "wrong-password"),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
